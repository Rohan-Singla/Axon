import { NextResponse } from "next/server";
import * as bitcoin from "bitcoinjs-lib";
import ecc from "@bitcoinerlab/secp256k1";
import ECPairFactory from "ecpair";

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

const Edra = process.env.BTC_RESERVE_ADDRESS!;
const BITCOIN_WIF_PRIVATE_KEY = process.env.BTC_PRIVATE_KEY_HEX!;
const network = process.env.BITCOIN_NETWORK!;

const bitcoinApiGateWay = {
  regtest: "https://bitcoin-api-gateway-regtest-devnet.zeuslayer.space",
  mainnet: "https://bitcoin-api-gateway.zeuslayer.io",
};

const feeRate = 2;
const NETWORK = network === "regtest" ? bitcoin.networks.regtest : bitcoin.networks.bitcoin;

type UTXO = {
  transaction_id: string;
  transaction_index: number;
  satoshis: number;
  block_height?: number;
};

async function fetchUtxos(address: string): Promise<UTXO[]> {
  const base = bitcoinApiGateWay[network as keyof typeof bitcoinApiGateWay];
  const url = `${base}/api/v1/address/${address}/utxos`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`UTXO fetch failed ${res.status} ${res.statusText}`);
  const data = (await res.json()).data;
  return data.map((u: any) => ({
    transaction_id: u.txid || u.transaction_id,
    transaction_index: u.vout ?? u.transaction_index,
    satoshis: u.value ?? u.satoshis,
    block_height: u.height ?? u.block_height ?? 0,
  }));
}

async function fetchTransaction(txid: string): Promise<string> {
  const base = bitcoinApiGateWay[network as keyof typeof bitcoinApiGateWay];
  const url = `${base}/api/v1/transaction/${txid}/detail`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Transaction fetch failed ${res.status} ${res.statusText}`);
  const data = await res.json();
  const hex = data.data?.transaction;
  if (!hex || typeof hex !== "string") {
    throw new Error(`Invalid transaction hex for ${txid}`);
  }
  return hex;
}

async function broadcastTransaction(txHex: string): Promise<string> {
  const base = bitcoinApiGateWay[network as keyof typeof bitcoinApiGateWay];
  const url = `${base}/api/v1/transaction/broadcast`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(txHex),
  });
  if (!res.ok)
    throw new Error(`Broadcast failed ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data.data;
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const amountParam = searchParams.get("amount");

    if (!amountParam) {
      throw new Error("Missing 'amount' query parameter");
    }

    const amount = parseFloat(amountParam) * 1e8;
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount value");
    }

    const { keypair, address } = createKeypairAndAddressP2WPKH(
      BITCOIN_WIF_PRIVATE_KEY
    );


    const utxos = await fetchUtxos(address);
    if (utxos.length === 0)
      throw new Error(`No UTXOs found for address ${address}`);

    const totalInputValue = utxos.reduce((sum: number, u: any) => sum + u.satoshis, 0);
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

    utxos.forEach((_: any, i: number) => psbt.signInput(i, keypair));
    psbt.finalizeAllInputs();

    const tx = psbt.extractTransaction();
    const txHex = tx.toHex();

    const txId = await broadcastTransaction(txHex);

    const zeusScanUrl = `https://www.zeusscan.io/search/${txId}?network=regtest-devnet`;
    const bitcoinExplorer = `https://bitcoin-regtest-devnet.zeusscan.space/tx/${txId}`;

    return NextResponse.json({
      success: true,
      txId,
      address,
      amountSent: amount / 1e8,
      changeAmount: changeAmount / 1e8,
      fee: estimatedFee / 1e8,
      zeusScanUrl,
      bitcoinExplorer,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}