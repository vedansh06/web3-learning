// create an account with some data

const solanaWeb3 = require("@solana/web3.js");
const fs = require("fs");

const {
  Keypair,
  Connection,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} = solanaWeb3;

// connection
const connection = new Connection(
  solanaWeb3.clusterApiUrl("devnet"),
  "confirmed"
);

// accounts
const dataAccount = Keypair.generate();
const payer = Keypair.fromSecretKey(
  new Uint8Array(
    JSON.parse(fs.readFileSync("/home/vedansh/.config/solana/id.json", "utf8"))
  )
);

async function createAccount() {
  const lamports = await connection.getMinimumBalanceForRentExemption(1000);

  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: dataAccount.publicKey,
      lamports,
      space: 1000,
      programId: SystemProgram.programId,
    })
  );

  const txId = await sendAndConfirmTransaction(connection, tx, [
    payer,
    dataAccount,
  ]);

  console.log(`Created account: ${dataAccount.publicKey.toBase58()}`);
  console.log(`Tx ID: ${txId}`);
}

createAccount();
