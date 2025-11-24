import axios from "axios";
import "./App.css";
import {
  Transaction,
  Connection,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const connection = new Connection(
  "https://solana-mainnet.g.alchemy.com/v2/x3Jntrzo3awqFKO_mv8dr"
);
const fromPubkey = new PublicKey(
  "BEty8qcP8nE5f7yt2ySL72cGLkKbB6bf9n9z2BQEAM2E"
);
function App() {
  async function sendSol() {
    const ix = SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: new PublicKey("4LD51PBzyRVybbo3fBfzX8sG8h9nntkmcXEbXqHiDJpP"),
      lamports: 0.01 * LAMPORTS_PER_SOL,
    });
    const tx = new Transaction().add(ix);

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = fromPubkey;

    // convert the transaction to a bunch of bytes
    const serializedTx = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    console.log(serializedTx);

    await axios.post("http://localhost:3000/api/v1/txn/sign", {
      message: serializedTx,
      retry: false,
    });
  }

  return (
    <div>
      <input type="text" placeholder="Amount"></input>
      <input type="text" placeholder="Address"></input>
      <button onClick={sendSol}>Submit</button>
    </div>
  );
}

export default App;
