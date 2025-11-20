import { useConnect } from "wagmi";

export default function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div className="section-card">
      <h3>Select Wallet</h3>
      <div className="wallet-buttons">
        {connectors.map((connector) => (
          <button
            key={connector.id}
            className="wallet-btn"
            onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        ))}
      </div>
    </div>
  );
}



















