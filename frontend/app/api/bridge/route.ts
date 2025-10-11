import { NextResponse } from "next/server";
import * as bitcoin from "bitcoinjs-lib";
import ecc from "@bitcoinerlab/secp256k1";
import ECPairFactory from "ecpair";

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

const Edra = process.env.BTC_RESERVE_ADDRESS!;
const BITCOIN_WIF_PRIVATE_KEY = process.env.BTC_PRIVATE_KEY_HEX!;
const network = process.env.BITCOIN_NETWORK || "";

const amount = 0.01 * 1e8;
const feeRate = 2;

const NETWORK = network === "regtest" ? bitcoin.networks.regtest : bitcoin.networks.bitcoin;

const RPC_USER = process.env.REGTEST_RPC_USER || "rpcuser";
const RPC_PASSWORD = process.env.REGTEST_RPC_PASSWORD || "rpcpassword";
const RPC_PORT = process.env.REGTEST_RPC_PORT || "18443";

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

    utxos.forEach((_: any, i: any) => psbt.signInput(i, keypair));
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
