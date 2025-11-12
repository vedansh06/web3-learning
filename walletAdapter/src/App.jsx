import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { Airdrop } from "./RequestAirdrop";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <ConnectionProvider endpoint="https://api.devnet.solana.com">
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <div className="wallet-controls">
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>
            <Airdrop />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

export default App;
