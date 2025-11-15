import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function ShowSolBalance() {
  const [balance, setBalance] = useState(0);

  const wallet = useWallet();
  const { connection } = useConnection();

  async function getBalance() {
    if (!wallet.publicKey) return;

    const bal = await connection.getBalance(wallet.publicKey);
    setBalance(bal / LAMPORTS_PER_SOL);
  }

  useEffect(() => {
    getBalance();
  }, [wallet.publicKey]);

  return (
    <div className="form-row">
      <button onClick={getBalance}>Refresh Balance</button>
      <div className="balance-box">{balance} SOL</div>
    </div>
  );
}
