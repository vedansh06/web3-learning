import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config";
import WalletOptions from "./WalletOptions";
import Account from "./Account";
import SendTransaction from "./SendTransaction";
import "./ui.css";


const queryClient = new QueryClient();

export default function App() {
  return (
    <div className="app-container">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <WalletOptions />
          <Account />
          <SendTransaction />
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}




















