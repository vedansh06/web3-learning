import { useAccount, useDisconnect, useBalance } from "wagmi";

export default function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance, isLoading } = useBalance({
    address,
    watch: true,
  });

  return (
    <div className="section-card">
      <h3>Wallet Details</h3>

      <p>Your address — {address}</p>
      <p>
        Your balance —{" "}
        {isLoading ? "Loading..." : balance?.formatted + " " + balance?.symbol}
      </p>

      <button className="disconnect-btn" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
}
























































