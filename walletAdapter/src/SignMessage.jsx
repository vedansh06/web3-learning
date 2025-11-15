import { useState } from "react";
import { ed25519 } from "@noble/curves/ed25519";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";

export default function SignMessage() {
  const [message, setMessage] = useState("");

  const { publicKey, signMessage } = useWallet();

  async function onClick() {
    if (!publicKey) return alert("Wallet not connected!");
    if (!signMessage) return alert("Wallet does not support signing!");

    const encoded = new TextEncoder().encode(message);
    const signature = await signMessage(encoded);

    if (!ed25519.verify(signature, encoded, publicKey.toBytes()))
      return alert("Signature invalid!");

    alert("Success: " + bs58.encode(signature));
  }

  return (
    <div className="form-row">
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={onClick}>Send Message</button>
    </div>
  );
}
