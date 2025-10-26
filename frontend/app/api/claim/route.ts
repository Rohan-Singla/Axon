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

const connection = new Connection(`${process.env.TRITON_BACKEND_RPC}`, "confirmed");

const ZBTC_MINT = new PublicKey(`${process.env.TOKEN_MINT_ADDRESS}`);
const REWARD_AUTHORITY_PRIVATE_KEY = process.env.REWARD_WALLET_SECRET!;
const rewardKeypair = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(REWARD_AUTHORITY_PRIVATE_KEY))
);

export async function POST(req: Request) {
  console.log("req received with publickey, ", req.json);
  try {
    const { claimer } = await req.json();
    if (!claimer) {
      return NextResponse.json({ error: "Missing claimer address" }, { status: 400 });
    }

    const claimerPubkey = new PublicKey(claimer);

    const fromTokenAccount = await getAssociatedTokenAddress(
      ZBTC_MINT,
      rewardKeypair.publicKey
    );
    const toTokenAccount = await getAssociatedTokenAddress(ZBTC_MINT, claimerPubkey);

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

    const transferIx = createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      rewardKeypair.publicKey,
      100_000_000
    );

    tx.add(transferIx);

    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = claimerPubkey;

    tx.partialSign(rewardKeypair);

    const serializedTx = tx.serialize({ requireAllSignatures: false }).toString("base64");

    return NextResponse.json({ tx: serializedTx });
  } catch (err) {
    console.error("Error building claim tx:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
