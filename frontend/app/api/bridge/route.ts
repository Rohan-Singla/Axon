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


// import { NextResponse } from "next/server";
// import { buildDepositTransaction } from "@zeus-network/zeus-stack-sdk/bitcoin";
// import type { UTXO } from "@zeus-network/zeus-stack-sdk/bitcoin";
// import * as bitcoin from "bitcoinjs-lib";
// import ecc from "@bitcoinerlab/secp256k1";
// import ECPairFactory from "ecpair";
// import { toXOnly } from "bitcoinjs-lib/src/psbt/bip371";

// bitcoin.initEccLib(ecc);
// const ECPair = ECPairFactory(ecc);

// const BTC_RESERVE_ADDRESS = process.env.BTC_RESERVE_ADDRESS!;
// const BTC_PRIVATE_KEY_HEX = process.env.BTC_PRIVATE_KEY_HEX!;
// const NETWORK = process.env.BITCOIN_NETWORK || "regtest";

// const FEE_RATE = 2;
// const AMOUNT = 0.01 * 1e8;

// const bitcoinApiGateway = {
//   regtest: "https://bitcoin-api-gateway-regtest-devnet.zeuslayer.space",
//   mainnet: "https://bitcoin-api-gateway.zeuslayer.io",
// };

// async function fetchUtxos(address: string): Promise<UTXO[]> {
//   const base = bitcoinApiGateway[NETWORK as keyof typeof bitcoinApiGateway];
//   const url = `${base}/api/v1/address/${address}/utxos`;

//   console.log("UTXO URL" , url);

//   const res = await fetch(url);
//   if (!res.ok) throw new Error(`UTXO fetch failed ${res.status} ${res.statusText}`);
//   const data = (await res.json()).data;

//   console.log("UTXO Data : " , data);

//   return data.map((u: any) => ({
//     transaction_id: u.transaction_id ?? u.txid,
//     transaction_index: u.transaction_index ?? u.vout,
//     satoshis: u.satoshis ?? u.value,
//     block_height: u.block_height ?? u.height ?? 0,
//   }));
// }

// async function broadcastTransaction(transactionHex: string): Promise<string> {
//   const base = bitcoinApiGateway[NETWORK as keyof typeof bitcoinApiGateway];
//   const url = `${base}/api/v1/transaction/broadcast`;
//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(transactionHex),
//   });
//   if (!res.ok) throw new Error(`Broadcast failed ${res.status} ${res.statusText}`);
//   return (await res.json()).data;
// }

// // -------- keypair + address ----------
// function createKeypairAndAddress(privWIF: string, network: bitcoin.Network) {
//   console.log("Private key WIF:", privWIF);

//   // Create keypair from WIF
//   const keypair = ECPair.fromWIF(privWIF, network);


//   // Taproot uses x-only pubkey (first 32 bytes of compressed pubkey)
//   const xOnlyPubkey = Buffer.from(toXOnly(keypair.publicKey));

//   // Generate P2TR address
//   const p2trPayment = bitcoin.payments.p2tr({
//     internalPubkey: xOnlyPubkey,
//     network,
//   });
//   if (!p2trPayment.address) throw new Error("Failed to generate P2TR address");

//   // Tweak the keypair (used for signing Taproot transactions)
//   const tweakedKeypair = keypair.tweak(bitcoin.crypto.taggedHash("TapTweak", xOnlyPubkey));

//   return {
//     keypair,          // original keypair
//     tweakedKeypair,   // tweaked keypair for signing
//     address: p2trPayment.address,
//     xOnlyPubkey,
//   };
// }

// function signPsbt(psbt: bitcoin.Psbt, tweakedKeypair: any) {
//   const tweakedSigner = {
//     publicKey: Buffer.from(tweakedKeypair.publicKey),
//     sign: (hash: Buffer) => Buffer.from(tweakedKeypair.sign(hash)),
//     signSchnorr: (hash: Buffer) => Buffer.from(tweakedKeypair.signSchnorr(hash)),
//   };

//   psbt.signAllInputs(tweakedSigner);
//   psbt.finalizeAllInputs();
//   return psbt;
// }

// export async function POST() {
//   try {
//     const net =
//       NETWORK === "regtest" ? bitcoin.networks.regtest : bitcoin.networks.bitcoin;

//     const { tweakedKeypair, address, xOnlyPubkey } = createKeypairAndAddress(
//       BTC_PRIVATE_KEY_HEX,
//       net
//     );

//     console.log(`[bridge] Taproot address: ${address}`);

//     const utxos = await fetchUtxos(address);
//     console.log(`[bridge] found ${utxos.length} utxos`);

//     const { psbt, returnAmount, usedUTXOs } = buildDepositTransaction(
//       utxos,
//       BTC_RESERVE_ADDRESS,
//       AMOUNT,
//       xOnlyPubkey,
//       FEE_RATE,
//       net
//     );

//     console.log(`[bridge] PSBT built, signing...`);
//     const signedPsbt = signPsbt(psbt, tweakedKeypair);
//     const tx = signedPsbt.extractTransaction();
//     const txHex = tx.toHex();
//     const txId = tx.getId();

//     console.log(`[bridge] txid: ${txId}`);

//     const broadcastResult = await broadcastTransaction(txHex);

//     const explorer =
//       NETWORK === "regtest"
//         ? `https://bitcoin-regtest-devnet.zeusscan.space/tx/${txId}`
//         : `https://mempool.space/tx/${txId}`;

//     return NextResponse.json({
//       txId,
//       explorer,
//       broadcastResult,
//       usedUTXOs,
//       returnAmount,
//     });
//   } catch (err: any) {
//     console.error("[bridge error]", err);
//     return NextResponse.json(
//       { error: err.message || "Bridge transaction failed" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import * as bitcoin from "bitcoinjs-lib";
import ecc from "@bitcoinerlab/secp256k1";
import ECPairFactory from "ecpair";

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

const Edra = process.env.BTC_RESERVE_ADDRESS!;
const BITCOIN_WIF_PRIVATE_KEY = process.env.BTC_PRIVATE_KEY_HEX!;
const network = process.env.BTC_NETWORK || "regtest";

const amount = 0.01 * 1e8; 
const feeRate = 2; 

const NETWORK = network === "regtest" ? bitcoin.networks.regtest : bitcoin.networks.bitcoin;

const RPC_USER = process.env.BTC_RPC_USER || "rpcuser";
const RPC_PASSWORD = process.env.BTC_RPC_PASSWORD || "rpcpassword";
const RPC_PORT = process.env.BTC_RPC_PORT || "18443";

async function callBitcoinRpc(method: string, params: any[] = []) {
  const res = await fetch(`http://127.0.0.1:${RPC_PORT}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${RPC_USER}:${RPC_PASSWORD}`).toString("base64"),
    },
    body: JSON.stringify({
      jsonrpc: "1.0",
      id: "curltest",
      method,
      params,
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  return data.result;
}

async function fetchUtxos(address: string) {
  const utxos = await callBitcoinRpc("listunspent", [0, 9999999, [address]]);
  return utxos.map((u: any) => ({
    transaction_id: u.txid,
    transaction_index: u.vout,
    satoshis: Math.round(u.amount * 1e8),
  }));
}

async function fetchTransaction(txid: string) {
  const tx = await callBitcoinRpc("gettransaction", [txid]);
  if (!tx.hex) throw new Error(`Transaction has no hex: ${txid}`);
  return tx.hex;
}

function createKeypairAndAddressP2WPKH(wif: string) {
  const keypair = ECPair.fromWIF(wif, NETWORK);
  const wrappedKeypair = {
    ...keypair,
    publicKey: Buffer.from(keypair.publicKey),
    sign: (hash: Buffer) => Buffer.from(keypair.sign(hash)),
  };

  const p2wpkhPayment = bitcoin.payments.p2wpkh({
    pubkey: wrappedKeypair.publicKey,
    network: NETWORK,
  });

  if (!p2wpkhPayment.address)
    throw new Error("Failed to generate P2WPKH address");

  return { keypair: wrappedKeypair, address: p2wpkhPayment.address };
}

export async function GET() {
  try {
    const { keypair, address } = createKeypairAndAddressP2WPKH(BITCOIN_WIF_PRIVATE_KEY);

    const utxos = await fetchUtxos(address);
    if (utxos.length === 0) throw new Error(`No UTXOs found for address ${address}`);

    const totalInputValue = utxos.reduce((sum, u) => sum + u.satoshis, 0);
    const estimatedSize = utxos.length * 148 + 43 + 34 + 10;
    const estimatedFee = estimatedSize * feeRate;
    const changeAmount = totalInputValue - amount - estimatedFee;
    if (changeAmount < 0) throw new Error("Insufficient funds");

    const psbt = new bitcoin.Psbt({ network: NETWORK });
    for (const utxo of utxos) {
      const prevTxHex = await fetchTransaction(utxo.transaction_id);
      psbt.addInput({
        hash: utxo.transaction_id,
        index: utxo.transaction_index,
        nonWitnessUtxo: Buffer.from(prevTxHex, "hex"),
      });
    }

    const amountBigInt = BigInt(Math.round(amount));
    const changeAmountBigInt = BigInt(Math.round(changeAmount));

    psbt.addOutput({ address: Edra, value: amountBigInt });
    if (changeAmount > 546) psbt.addOutput({ address, value: changeAmountBigInt });

    utxos.forEach((_ : any, i : any) => psbt.signInput(i, keypair));
    psbt.finalizeAllInputs();

    const tx = psbt.extractTransaction();
    const txHex = tx.toHex();
    const txId = await callBitcoinRpc("sendrawtransaction", [txHex]);

    return NextResponse.json({
      success: true,
      txId,
      changeAmount,
      fee: estimatedFee,
      address,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message || "Unknown error" }, { status: 500 });
  }
}
