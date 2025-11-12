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

//! show the SOL balances for these accounts

// import { useState } from "react";
// import { mnemonicToSeed } from "bip39";
// import { derivePath } from "ed25519-hd-key";
// import { Keypair, Connection, clusterApiUrl } from "@solana/web3.js";
// import nacl from "tweetnacl";

// export default function SolanaWallet({ mnemonic }) {
//   const [index, setIndex] = useState(0);
//   const [keys, setKeys] = useState([]);

//   const copy = (txt) => navigator.clipboard.writeText(txt);

//   const addWallet = async () => {
//     const seed = await mnemonicToSeed(mnemonic);
//     const path = `m/44'/501'/${index}'/0'`;
//     const derivedSeed = derivePath(path, seed.toString("hex")).key;
//     const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
//     const keypair = Keypair.fromSecretKey(secret);

//     const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
//     const balanceLamports = await connection.getBalance(keypair.publicKey);
//     const balanceSol = balanceLamports / 1e9;

//     setIndex(index + 1);
//     setKeys([
//       ...keys,
//       { pub: keypair.publicKey.toBase58(), balance: balanceSol },
//     ]);
//   };

//   return (
//     <div>
//       <button className="up-btn neon-3d-btn" onClick={addWallet}>
//         + Add Solana Wallet
//       </button>

//       {keys.map((k, i) => (
//         <div key={i} className="up-address-glass">
//           <div className="addr-title">SOL Address</div>
//           <div className="addr-text">{k.pub}</div>
//           <div className="addr-balance">Balance: {k.balance} SOL</div>
//           <button className="copy-btn" onClick={() => copy(k.pub)}>
//             ⧉
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }
