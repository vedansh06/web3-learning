import { useState } from "react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

export default function SendTokens() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const wallet = useWallet();
  const { connection } = useConnection();

  async function sendTokens() {
    if (!wallet.publicKey) return alert("Connect wallet first!");

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(to),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    await wallet.sendTransaction(transaction, connection);
    alert(`Sent ${amount} SOL to ${to}`);
  }

  return (
    <div className="form-row">
      <input
        type="text"
        placeholder="Receiver Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={sendTokens}>Send</button>
    </div>
  );
}
