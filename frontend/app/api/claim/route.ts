import { NextResponse } from "next/server";
import {
  Connection,
  PublicKey,
  Transaction,
  Keypair,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import axios from "axios";

export const dynamic = "force-dynamic";

const connection = new Connection(process.env.TRITON_BACKEND_RPC || "", "confirmed");

let rewardKeypair: Keypair | null = null;
function getRewardKeypair() {
  if (!rewardKeypair) {
    const raw = process.env.REWARD_WALLET_SECRET;
    if (!raw) throw new Error("Missing REWARD_WALLET_SECRET env var");
    try {
      rewardKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw)));
    } catch (err) {
      console.error("❌ Failed to parse REWARD_WALLET_SECRET:", err);
      throw new Error("Invalid REWARD_WALLET_SECRET format");
    }
  }
  return rewardKeypair;
}

const ZBTC_MINT = new PublicKey(process.env.TOKEN_MINT_ADDRESS || "");

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { claimer } = body;
    if (!claimer) {
      return NextResponse.json({ error: "Missing claimer address" }, { status: 400 });
    }

    const rewardKeypair = getRewardKeypair();
    const claimerPubkey = new PublicKey(claimer);

    const fromTokenAccount = await getAssociatedTokenAddress(
      ZBTC_MINT,
      rewardKeypair.publicKey
    );

    const toTokenAccount = await getAssociatedTokenAddress(
      ZBTC_MINT,
      claimerPubkey
    );

    const toAccountInfo = await connection.getAccountInfo(toTokenAccount);
    const tx = new Transaction();

    if (!toAccountInfo) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          rewardKeypair.publicKey,
          toTokenAccount,
          claimerPubkey,
          ZBTC_MINT
        )
      );
    }

    const backendUrl = process.env.TRITON_BACKEND_RPC;
    if (!backendUrl) {
      return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });
    }

   
    const minerRes = await axios.get(`${backendUrl}/users/wallet/${claimer}`);
    const miner_id = minerRes.data?.miner_id;
    if (!miner_id) {
      return NextResponse.json({ error: "Miner ID not found" }, { status: 404 });
    }

     
    const contriRes = await axios.get(`${backendUrl}/shares/contributions/${miner_id}`);
    const contribution = contriRes.data?.contribution ?? 0;

   
    const fromTokenAccInfo = await connection.getTokenAccountBalance(fromTokenAccount);
    const balance = parseFloat(fromTokenAccInfo?.value?.amount ?? "0");

   
    const amount = contribution * balance;

    if (amount <= 0) {
      return NextResponse.json({ error: "No reward to distribute" }, { status: 400 });
    }

    
    const transferIx = createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      rewardKeypair.publicKey,
      amount//10000
    );
    tx.add(transferIx);

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = claimerPubkey;
    tx.partialSign(rewardKeypair);

    const serializedTx = tx.serialize({ requireAllSignatures: false }).toString("base64");

    return NextResponse.json({ tx: serializedTx });
  } catch (err) {
    console.error("❌ Error in /api/claim:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
