import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function Airdrop() {
  const wallet = useWallet();
  const { connection } = useConnection();

  async function sendAirdropToUser() {
    try {
      const amount = parseFloat(document.getElementById("publicKey").value);

      if (!wallet.publicKey) {
        alert("❌ Wallet not connected!");
        return;
      }

      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        amount * LAMPORTS_PER_SOL
      );

      await connection.confirmTransaction(signature, "confirmed");
      alert(`✅ Airdropped ${amount} SOL successfully!`);
    } catch (error) {
      console.error("Airdrop error:", error);
      alert("❌ Airdrop failed. Check console for details.");
    }
  }

  return (
    <div className="airdrop-container">
      <h2> Request SOL Airdrop</h2>
      <input
        id="publicKey"
        type="number"
        placeholder="Enter Amount (SOL)"
        className="airdrop-input"
      />
      <button onClick={sendAirdropToUser} className="airdrop-button">
        Request Airdrop
      </button>
    </div>
  );
}
