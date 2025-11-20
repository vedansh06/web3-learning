import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";

export default function SendTransaction() {
  const { data, sendTransaction } = useSendTransaction();

  function sendTx() {
    const to = document.getElementById("to").value;
    const value = document.getElementById("value").value;

    sendTransaction({
      to,
      value: parseEther(value),
    });
  }

  return (
    <div className="section-card">
      <h3>Send ETH</h3>

      <div className="tx-row">
        <input id="to" className="tx-input" placeholder="Receiver Address" />
        <input id="value" className="tx-input" placeholder="0" />
        <button className="tx-btn" onClick={sendTx}>
          Send
        </button>
      </div>

      {data?.hash && <p>Transaction Hash: {data.hash}</p>}
    </div>
  );
}
