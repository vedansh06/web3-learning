const { PublicKey } = require("@solana/web3.js");
const {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} = require("@solana/spl-token");

const userAddress = new PublicKey(
  "DS3N3EAHjsgukXC8gQ6fPVqH2yoSArRyJU6uXNKwjG2E"
);
const tokenMintAddress = new PublicKey(
  "35dgRd7mAhKNsbytzwRDC2QSgnB2MffBfSfVfPUdoQR1"
);

const getAssociatedTokenAddress = (mintAddress, ownerAddress) => {
  return PublicKey.findProgramAddressSync(
    [
      ownerAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mintAddress.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
};

const [associatedTokenAddress, bump] = getAssociatedTokenAddress(
  tokenMintAddress,
  userAddress
);
console.log(
  `Associated Token Address: ${associatedTokenAddress.toBase58()}, bump: ${bump}`
);

const PDA = PublicKey.createProgramAddressSync(
  [
    userAddress.toBuffer(),
    TOKEN_PROGRAM_ID.toBuffer(),
    tokenMintAddress.toBuffer(),
    Buffer.from([255]),
  ],
  ASSOCIATED_TOKEN_PROGRAM_ID
);

console.log(`PDA: ${PDA}`);
