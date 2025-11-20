import { createConfig, http } from "wagmi";
import { mainnet, base, polygon, sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, base, polygon, sepolia],
  transports: {
    [mainnet.id]: http("https://eth.llamarpc.com"),
    [base.id]: http("https://base.llamarpc.com"),
    [polygon.id]: http("https://polygon.llamarpc.com"),
    [sepolia.id]: http("https://rpc.ankr.com/eth_sepolia"),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: "YOUR_PROJECT_ID",
    }),
  ],
});














