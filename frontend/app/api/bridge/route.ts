import { NextResponse } from "next/server";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as tinysecp from "tiny-secp256k1";
import { buildDepositTransaction, type UTXO } from "@zeus-network/zeus-stack-sdk/bitcoin";

const ECPair = ECPairFactory(tinysecp);

const BTC_NETWORK = bitcoin.networks.regtest;
const BTC_RESERVE_ADDRESS = process.env.BTC_RESERVE_ADDRESS!;
const REGTEST_RPC_USER = "rpcuser";
const REGTEST_RPC_PASSWORD = "rpcpassword";
const REGTEST_RPC_URL = process.env.REGTEST_RPC_URL || "http://127.0.0.1:18443/";
const WALLET_PRIVATE_KEY_WIF = process.env.BTC_WALLET_KEY!;

async function rpcCall(method: string, params: any[] = []) {
  const res = await fetch(REGTEST_RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(`${REGTEST_RPC_USER}:${REGTEST_RPC_PASSWORD}`).toString("base64"),
    },
    body: JSON.stringify({ jsonrpc: "1.0", id: "bridge", method, params }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`${method} RPC error: ${JSON.stringify(data.error)}`);
  return data.result;
}

async function waitForConfirmations(txid: string, confirmations = 1) {
  while (true) {
    const tx = await rpcCall("getrawtransaction", [txid, true]);
    if (tx.confirmations && tx.confirmations >= confirmations) return tx;
    console.log(`⏳ Waiting for confirmation... (${tx.confirmations || 0}/${confirmations})`);
    await new Promise((r) => setTimeout(r, 2000));
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { depositAmount, bitcoinUTXOs } = body;

    if (!BTC_RESERVE_ADDRESS) throw new Error("BTC_RESERVE_ADDRESS not set");
    if (!depositAmount || depositAmount <= 0) throw new Error("Invalid deposit amount");
    if (!bitcoinUTXOs?.length) throw new Error("No UTXOs provided");
    if (!WALLET_PRIVATE_KEY_WIF) throw new Error("Missing sender private key");

    const utxos: UTXO[] = bitcoinUTXOs.map((u: any) => ({
      transaction_id: u.txid,
      transaction_index: Number(u.vout),
      satoshis: Math.floor(Number(u.amount) * 1e8),
      block_height: Number(u.block_height ?? 0),
    }));

    console.log("UTXO : ", utxos);

    const keyPair = ECPair.fromWIF(WALLET_PRIVATE_KEY_WIF, BTC_NETWORK);
    const xOnly = keyPair.publicKey.slice(1, 33);

    const userXOnlyPublicKey: Buffer = Buffer.from(xOnly.buffer, xOnly.byteOffset, xOnly.byteLength);

    const feeRate = 1;

    const { psbt } = buildDepositTransaction(
      utxos,
      BTC_RESERVE_ADDRESS,
      Math.floor(depositAmount * 1e8),
      userXOnlyPublicKey,
      feeRate,
      BTC_NETWORK
    );

    console.log("PSBT Tx : ", psbt);

    // psbt.signAllInputs(keyPair as unknown as any);

    psbt.data.inputs.forEach((input, idx) => {
      // Only sign if key controls the UTXO
      psbt.signInput(idx, keyPair as unknown as any);
    });

    psbt.finalizeAllInputs();
    const signedTxHex = psbt.extractTransaction().toHex();

    console.log("Signed TX Hex : ", signedTxHex);

    const txid = await rpcCall("sendrawtransaction", [signedTxHex]);
    console.log("✅ Deposit broadcasted:", txid);

    await waitForConfirmations(txid, 1);
    console.log("✅ Deposit confirmed on BTC chain");

    return NextResponse.json({
      btcTxid: txid,
      reserveAddress: BTC_RESERVE_ADDRESS,
    });
  } catch (err: any) {
    console.error("Bridge error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
