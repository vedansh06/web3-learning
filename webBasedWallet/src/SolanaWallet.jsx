import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export default function SolanaWallet({ mnemonic }) {
  const [index, setIndex] = useState(0);
  const [keys, setKeys] = useState([]);

  const copy = (txt) => navigator.clipboard.writeText(txt);

  return (
    <div>
      <button
        className="up-btn neon-3d-btn"
        onClick={() => {
          const seed = mnemonicToSeed(mnemonic);
          const path = `m/44'/501'/${index}'/0'`;
          const derive = derivePath(path, seed.toString("hex")).key;

          const secret = nacl.sign.keyPair.fromSeed(derive).secretKey;
          const keypair = Keypair.fromSecretKey(secret);

          setIndex(index + 1);
          setKeys([...keys, keypair.publicKey.toBase58()]);
        }}>
        + Add Solana Wallet
      </button>

      {keys.map((k) => (
        <div key={k} className="up-address-glass">
          <div className="addr-title">SOL Address</div>
          <div className="addr-text">{k}</div>
          <button className="copy-btn" onClick={() => copy(k)}>
            ⧉
          </button>
        </div>
      ))}
    </div>
  );
}
