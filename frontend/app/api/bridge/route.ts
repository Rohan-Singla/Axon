import { NextResponse } from "next/server";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as tinysecp from "tiny-secp256k1";
import { buildDepositTransaction, type UTXO } from "@zeus-network/zeus-stack-sdk/bitcoin";
import BN from "bn.js";
import { Connection, Keypair, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
// import ZplApi from "@/programs/zpl"; // uncomment if you have it locally

const ECPair = ECPairFactory(tinysecp);

// ⚙️ Config
const BTC_NETWORK = bitcoin.networks.regtest;
const BTC_RESERVE_ADDRESS = process.env.BTC_RESERVE_ADDRESS!;
const REGTEST_RPC_USER = process.env.REGTEST_RPC_USER || "rpcuser";
const REGTEST_RPC_PASSWORD = process.env.REGTEST_RPC_PASSWORD || "rpcpassword";
const REGTEST_RPC_URL = process.env.REGTEST_RPC_URL || "http://127.0.0.1:18443/";
const WALLET_PRIVATE_KEY_WIF = process.env.SENDER_PRIVATE_KEY!;
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "http://127.0.0.1:8899";
const SOLANA_PRIVATE_KEY = process.env.SOLANA_PRIVATE_KEY!; // base58 or JSON array string

// --- helper for bitcoin rpc
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

// --- wait for confirmations
async function waitForConfirmations(txid: string, confirmations = 1) {
  while (true) {
    const tx = await rpcCall("getrawtransaction", [txid, true]);
    if (tx.confirmations && tx.confirmations >= confirmations) return tx;
    console.log(`⏳ Waiting for confirmation... (${tx.confirmations || 0}/${confirmations})`);
    await new Promise((r) => setTimeout(r, 2000));
  }
}

// --- placeholder claim function (runs on Solana)
async function claimZbtc({
  txid,
  amountSats,
  recipient,
}: {
  txid: string;
  amountSats: number;
  recipient: string;
}) {
  console.log("🪙 Claiming zBTC for deposit:", txid);

  // 1️⃣ Connect to Solana + signer
  const conn = new Connection(SOLANA_RPC_URL, "confirmed");
  const secret = JSON.parse(SOLANA_PRIVATE_KEY);
  const signer = Keypair.fromSecretKey(Uint8Array.from(secret));

  // 2️⃣ Prepare on-chain call
  // 👉 Replace this with your actual Zeus ZPL client logic.
  // For now, we simulate a Solana tx "claim zBTC"
  const ix = new bitcoin.Transaction(); // placeholder — you’ll replace with ZPL instruction
  console.log(`(Simulating claim for ${amountSats / 1e8} BTC to ${recipient})`);

  // Example (pseudo): 
  // const twoWayPegClient = await zplApi.twoWayPegClient();
  // const ix = await twoWayPegClient.instructions.buildClaimDepositIx(
  //   new BN(amountSats),
  //   Buffer.from(txid, "hex"),
  //   new PublicKey(recipient)
  // );

  // Build and send fake Solana tx for now
  const msg = new TransactionMessage({
    payerKey: signer.publicKey,
    recentBlockhash: (await conn.getLatestBlockhash()).blockhash,
    instructions: [], // replace [] with [ix] when you integrate Zeus SDK
  }).compileToV0Message();
  const tx = new VersionedTransaction(msg);
  tx.sign([signer]);
  const sig = await conn.sendTransaction(tx);
  console.log("✅ Simulated claim tx:", sig);
  return sig;
}

// --- API handler
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { depositAmount, bitcoinUTXOs, solanaRecipient } = body;

    if (!BTC_RESERVE_ADDRESS) throw new Error("BTC_RESERVE_ADDRESS not set");
    if (!depositAmount || depositAmount <= 0) throw new Error("Invalid deposit amount");
    if (!bitcoinUTXOs?.length) throw new Error("No UTXOs provided");
    if (!WALLET_PRIVATE_KEY_WIF) throw new Error("Missing sender private key");
    if (!solanaRecipient) throw new Error("Missing solanaRecipient");

    // Convert UTXOs
    const utxos: UTXO[] = bitcoinUTXOs.map((u: any) => ({
      transaction_id: u.txid,
      transaction_index: Number(u.vout),
      satoshis: Math.floor(Number(u.amount) * 1e8),
      block_height: Number(u.block_height ?? 0),
    }));

    // Build + sign deposit tx
    const keyPair = ECPair.fromWIF(WALLET_PRIVATE_KEY_WIF, BTC_NETWORK);
    const userXOnlyPublicKey = keyPair.publicKey.slice(1, 33);
    const feeRate = 1;

    const { psbt } = buildDepositTransaction(
      utxos,
      BTC_RESERVE_ADDRESS,
      Math.floor(depositAmount * 1e8),
      userXOnlyPublicKey,
      feeRate,
      BTC_NETWORK
    );

    psbt.signAllInputs(keyPair);
    psbt.finalizeAllInputs();
    const signedTxHex = psbt.extractTransaction().toHex();

    // Broadcast
    const txid = await rpcCall("sendrawtransaction", [signedTxHex]);
    console.log("✅ Deposit broadcasted:", txid);

    // Wait for 1 confirmation on regtest
    await waitForConfirmations(txid, 1);
    console.log("✅ Deposit confirmed on BTC chain");

    // Call claimZbtc to mint zBTC on Solana
    const claimSig = await claimZbtc({
      txid,
      amountSats: Math.floor(depositAmount * 1e8),
      recipient: solanaRecipient,
    });

    return NextResponse.json({
      btcTxid: txid,
      zbtcClaimTx: claimSig,
      reserveAddress: BTC_RESERVE_ADDRESS,
    });
  } catch (err: any) {
    console.error("Bridge error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
