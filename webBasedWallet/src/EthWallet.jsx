import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";

export const EthWallet = ({ mnemonic }) => {
  const [index, setIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);

  const copy = (txt) => navigator.clipboard.writeText(txt);

  return (
    <div>
      <button
        className="up-btn neon-3d-btn"
        onClick={async () => {
          const seed = await mnemonicToSeed(mnemonic);
          const path = `m/44'/60'/${index}'/0'`;
          const hd = HDNodeWallet.fromSeed(seed);
          const child = hd.derivePath(path);
          const wallet = new Wallet(child.privateKey);

          setIndex(index + 1);
          setAddresses([...addresses, wallet.address]);
        }}>
        + Add ETH Wallet
      </button>

      {addresses.map((addr) => (
        <div key={addr} className="up-address-glass">
          <div className="addr-title">ETH Address</div>
          <div className="addr-text">{addr}</div>

          <button className="copy-btn" onClick={() => copy(addr)}>
            ⧉
          </button>
        </div>
      ))}
    </div>
  );
};
