import "./App.css";
import SolanaWallet from "./SolanaWallet";
import { EthWallet } from "./EthWallet";
import { generateMnemonic } from "bip39";
import { useState } from "react";

function App() {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <div className="up-wrapper">
      <h1 className="up-title">⚡ Web3 Multi-Chain Wallet</h1>
      <p className="up-subtitle">
        Generate Ultra-Secure Solana & Ethereum Wallets
      </p>

      <div className="up-wallet-container">
        {/* Solana */}
        <div className="up-card animated-card">
          <div className="up-card-header">
            <img
              src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png"
              class="chain-icon"
            />

            <span>Solana Wallet</span>
          </div>

          <SolanaWallet mnemonic={mnemonic} />
        </div>

        {/* Ethereum */}
        <div className="up-card animated-card">
          <div className="up-card-header">
            <img
              src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
              class="chain-icon"
            />

            <span>Ethereum Wallet</span>
          </div>

          <EthWallet mnemonic={mnemonic} />
        </div>

        {/* Seed Phrase Generator */}
        <div className="up-card animated-card">
          <button
            className="up-btn neon-3d-btn"
            onClick={async () => {
              const mn = await generateMnemonic();
              setMnemonic(mn);
            }}>
            ✨ Generate Seed Phrase
          </button>

          <div className="seed-box-glass">
            <input
              readOnly
              value={mnemonic}
              placeholder="Seed phrase will appear here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
