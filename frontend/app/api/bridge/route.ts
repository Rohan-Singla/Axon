// import { NextResponse } from "next/server";
// import * as bitcoin from "bitcoinjs-lib";
// import ECPairFactory from "ecpair";
// import * as tinysecp from "tiny-secp256k1";
// import { buildDepositTransaction, type UTXO } from "@zeus-network/zeus-stack-sdk/bitcoin";

// const ECPair = ECPairFactory(tinysecp);

// const BTC_NETWORK = bitcoin.networks.regtest;
// const BTC_RESERVE_ADDRESS = process.env.BTC_RESERVE_ADDRESS!;
// const REGTEST_RPC_USER = "rpcuser";
// const REGTEST_RPC_PASSWORD = "rpcpassword";
// const REGTEST_RPC_URL = process.env.REGTEST_RPC_URL || "http://127.0.0.1:18443/";
// const WALLET_PRIVATE_KEY_WIF = process.env.BTC_WALLET_KEY!;

// async function rpcCall(method: string, params: any[] = []) {
//   const res = await fetch(REGTEST_RPC_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization:
//         "Basic " + Buffer.from(`${REGTEST_RPC_USER}:${REGTEST_RPC_PASSWORD}`).toString("base64"),
//     },
//     body: JSON.stringify({ jsonrpc: "1.0", id: "bridge", method, params }),
//   });
//   const data = await res.json();
//   if (data.error) throw new Error(`${method} RPC error: ${JSON.stringify(data.error)}`);
//   return data.result;
// }

// async function waitForConfirmations(txid: string, confirmations = 1) {
//   while (true) {
//     const tx = await rpcCall("getrawtransaction", [txid, true]);
//     if (tx.confirmations && tx.confirmations >= confirmations) return tx;
//     console.log(`⏳ Waiting for confirmation... (${tx.confirmations || 0}/${confirmations})`);
//     await new Promise((r) => setTimeout(r, 2000));
//   }
// };

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { depositAmount, bitcoinUTXOs } = body;

//     if (!BTC_RESERVE_ADDRESS) throw new Error("BTC_RESERVE_ADDRESS not set");
//     if (!depositAmount || depositAmount <= 0) throw new Error("Invalid deposit amount");
//     if (!bitcoinUTXOs?.length) throw new Error("No UTXOs provided");
//     if (!WALLET_PRIVATE_KEY_WIF) throw new Error("Missing sender private key");

//     const utxos: UTXO[] = bitcoinUTXOs.map((u: any) => ({
//       transaction_id: u.txid,
//       transaction_index: Number(u.vout),
//       satoshis: Math.floor(Number(u.amount) * 1e8),
//       block_height: Number(u.block_height ?? 0),
//     }));

//     console.log("UTXO : ", utxos);

//     const keyPair = ECPair.fromWIF(WALLET_PRIVATE_KEY_WIF, BTC_NETWORK);
//     const xOnly = keyPair.publicKey.slice(1, 33);

//     const userXOnlyPublicKey: Buffer = Buffer.from(xOnly.buffer, xOnly.byteOffset, xOnly.byteLength);

//     const feeRate = 1;

//     const { psbt } = buildDepositTransaction(
//       utxos,
//       BTC_RESERVE_ADDRESS,
//       Math.floor(depositAmount * 1e8),
//       userXOnlyPublicKey,
//       feeRate,
//       BTC_NETWORK
//     );

//     console.log("PSBT Tx : ", psbt);

//     // psbt.signAllInputs(keyPair as unknown as any);

//     psbt.data.inputs.forEach((input, idx) => {
//       // Only sign if key controls the UTXO
//       psbt.signInput(idx, keyPair as unknown as any);
//     });

//     psbt.finalizeAllInputs();
//     const signedTxHex = psbt.extractTransaction().toHex();

//     console.log("Signed TX Hex : ", signedTxHex);

//     const txid = await rpcCall("sendrawtransaction", [signedTxHex]);
//     console.log("✅ Deposit broadcasted:", txid);

//     await waitForConfirmations(txid, 1);
//     console.log("✅ Deposit confirmed on BTC chain");

//     return NextResponse.json({
//       btcTxid: txid,
//       reserveAddress: BTC_RESERVE_ADDRESS,
//     });
//   } catch (err: any) {
//     console.error("Bridge error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { buildDepositTransaction } from "@zeus-network/zeus-stack-sdk/bitcoin";
import type { UTXO } from "@zeus-network/zeus-stack-sdk/bitcoin";
import * as bitcoin from "bitcoinjs-lib";
import ecc from "@bitcoinerlab/secp256k1";
import ECPairFactory from "ecpair";
import { toXOnly } from "bitcoinjs-lib/src/psbt/bip371";

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

const BTC_RESERVE_ADDRESS = process.env.BTC_RESERVE_ADDRESS!;
const BTC_PRIVATE_KEY_HEX = process.env.BTC_PRIVATE_KEY_HEX!;
const NETWORK = process.env.BITCOIN_NETWORK || "regtest";

const FEE_RATE = 2; 
const AMOUNT = 0.01 * 1e8; 

const bitcoinApiGateway = {
  regtest: "https://bitcoin-api-gateway-regtest-devnet.zeuslayer.space",
  mainnet: "https://bitcoin-api-gateway.zeuslayer.io",
};

async function fetchUtxos(address: string): Promise<UTXO[]> {
  const base = bitcoinApiGateway[NETWORK as keyof typeof bitcoinApiGateway];
  const url = `${base}/api/v1/address/${address}/utxos`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`UTXO fetch failed ${res.status} ${res.statusText}`);
  const data = (await res.json()).data;

  return data.map((u: any) => ({
    transaction_id: u.transaction_id ?? u.txid,
    transaction_index: u.transaction_index ?? u.vout,
    satoshis: u.satoshis ?? u.value,
    block_height: u.block_height ?? u.height ?? 0,
  }));
}

async function broadcastTransaction(transactionHex: string): Promise<string> {
  const base = bitcoinApiGateway[NETWORK as keyof typeof bitcoinApiGateway];
  const url = `${base}/api/v1/transaction/broadcast`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transactionHex),
  });
  if (!res.ok) throw new Error(`Broadcast failed ${res.status} ${res.statusText}`);
  return (await res.json()).data;
}

// -------- keypair + address ----------
function createKeypairAndAddress(privHex: string, network: bitcoin.Network) {

  console.log("Private key HEX" , privHex);

  const keypair = ECPair.fromPrivateKey(Buffer.from(privHex, "hex"));
  const xOnlyPubkey = Buffer.from(toXOnly(keypair.publicKey));
  const p2trPayment = bitcoin.payments.p2tr({ internalPubkey: xOnlyPubkey, network });
  if (!p2trPayment.address) throw new Error("Failed to generate p2tr address");

  const tweakedKeypair = keypair.tweak(
    bitcoin.crypto.taggedHash("TapTweak", xOnlyPubkey)
  );

  return {
    keypair,
    tweakedKeypair,
    address: p2trPayment.address,
    xOnlyPubkey,
  };
}

function signPsbt(psbt: bitcoin.Psbt, tweakedKeypair: any) {
  const tweakedSigner = {
    publicKey: Buffer.from(tweakedKeypair.publicKey),
    sign: (hash: Buffer) => Buffer.from(tweakedKeypair.sign(hash)),
    signSchnorr: (hash: Buffer) => Buffer.from(tweakedKeypair.signSchnorr(hash)),
  };

  psbt.signAllInputs(tweakedSigner);
  psbt.finalizeAllInputs();
  return psbt;
}

export async function POST() {
  try {
    const net =
      NETWORK === "regtest" ? bitcoin.networks.regtest : bitcoin.networks.bitcoin;

    const { tweakedKeypair, address, xOnlyPubkey } = createKeypairAndAddress(
      BTC_PRIVATE_KEY_HEX,
      net
    );

    console.log(`[bridge] Taproot address: ${address}`);

    const utxos = await fetchUtxos(address);
    console.log(`[bridge] found ${utxos.length} utxos`);

    const { psbt, returnAmount, usedUTXOs } = buildDepositTransaction(
      utxos,
      BTC_RESERVE_ADDRESS,
      AMOUNT,
      xOnlyPubkey,
      FEE_RATE,
      net
    );

    console.log(`[bridge] PSBT built, signing...`);
    const signedPsbt = signPsbt(psbt, tweakedKeypair);
    const tx = signedPsbt.extractTransaction();
    const txHex = tx.toHex();
    const txId = tx.getId();

    console.log(`[bridge] txid: ${txId}`);

    const broadcastResult = await broadcastTransaction(txHex);

    const explorer =
      NETWORK === "regtest"
        ? `https://bitcoin-regtest-devnet.zeusscan.space/tx/${txId}`
        : `https://mempool.space/tx/${txId}`;

    return NextResponse.json({
      txId,
      explorer,
      broadcastResult,
      usedUTXOs,
      returnAmount,
    });
  } catch (err: any) {
    console.error("[bridge error]", err);
    return NextResponse.json(
      { error: err.message || "Bridge transaction failed" },
      { status: 500 }
    );
  }
}
