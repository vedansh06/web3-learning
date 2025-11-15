import React, { useMemo } from "react";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

import {
  WalletModalProvider,
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";

import RequestAirdrop from "./RequestAirdrop";
import ShowSolBalance from "./ShowSolBalance";
import SendTokens from "./SendTokens";
import SignMessage from "./SignMessage";

import "./App.css";

function App() {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* --- Main Layout --- */}
          <div className="main-container">
            {/* --- Left Side Wallet Buttons --- */}
            <div className="left-panel">
              <div className="solana-box">
                <WalletMultiButton />
                <WalletDisconnectButton />
              </div>
            </div>

            {/* --- Right Dashboard Panel --- */}
            <div className="right-panel">
              <RequestAirdrop />
              <ShowSolBalance />
              <SendTokens />
              <SignMessage />
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
