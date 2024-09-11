import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorExample } from "../target/types/anchor_example";
import { Keypair, clusterApiUrl, Connection } from "@solana/web3.js";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";
import * as borsh from "@coral-xyz/borsh"
// import { publicKey } from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js";




const AchievementDataSchema = borsh.struct([
  borsh.str("name"), // Name of the achievement
  borsh.vec(borsh.str(), "wallets") // Array of wallet addresses
]);

const DatabaseSchema = borsh.struct([
  borsh.u64("achievements_count"), // Count of achievements
  borsh.vec(AchievementDataSchema, "achievements") // Vector of achievements
]);

describe("metaplex-core-nft", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const wallet = anchor.Wallet.local();
  console.log("Wallet Public Key:", wallet);
  const program = anchor.workspace.anchor_example as Program<AnchorExample>;
  // console.log("Program ID:", program.programId.toString());

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // const collection = Keypair.generate();
  const collection = {publicKey:new PublicKey("7K65n84FyNT9kWASGiLXR1F8mpkVFmFwrN7Xy5FFhu1h")};
  const asset = Keypair.generate();
  // const database = {publicKey:new PublicKey("FfYgLFMz7J1jjui9nNJ1sBLRctCBgN4R99Y4ZisSt3jW")}; 
  const database = Keypair.generate(); 
  // Account for storing the Database

  const userData = {
    follower_count: new anchor.BN(1),
    dscvr_points: new anchor.BN(1000),
    streak: {
      day_count: new anchor.BN(3),
      multiplier_count: new anchor.BN(6)
    }
  };

  // console.log('accoutns', program);

  const fetchAndLogDatabaseAccount = async () => {
    const accountInfo = await connection.getAccountInfo(database.publicKey);
    console.log("database key", database.publicKey)
    if (accountInfo) {
      // console.log('Database Account Data:', accountInfo.data);
      // console.log('Raw Account Data Length:', accountInfo.data.length);
      // const buffer = Buffer.from(accountInfo.data);
      // console.log(buffer.toString("ascii"));
      // console.log(buffer.toString("utf-16le"))
      // console.log(buffer.toString("utf-8"))
      let a = await program.account.database.fetch(database.publicKey)
      console.log("a",a);


      // const decodedData = DatabaseSchema.decode(buffer);
      // console.log("Decoded Data:", JSON.stringify(decodedData, null, 2));
    } else {
      console.log('Database account not found.');
    }
  };

  before(async () => {
    // Initialize the Database account before running tests
    await program.methods.initializeDatabase()
      .accounts({
        signer: wallet.publicKey,
        payer: wallet.publicKey,
        database: database.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([wallet.payer, database])
      .rpc();

    console.log("Initialized Database Account: ", database.publicKey.toString());
    await fetchAndLogDatabaseAccount(); // Log data after initialization
  });

  // it("Create Collection!", async () => {
  //   const tx = await program.methods
  //     .createCollection()
  //     .accounts({
  //       signer: wallet.publicKey,
  //       payer: wallet.publicKey,
  //       collection: collection.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .signers([wallet.payer, collection])
  //     .rpc();

  //   console.log("Create Collection ", collection.publicKey.toString());

  //   console.log("Create Collection Transaction:", tx);
  // });

  it("Create Asset Based on Achievement!", async () => {
    console.log("Creating Asset based on Achievement data:", userData);
    // await fetchAndLogDatabaseAccount(); // Log data before creating the asset
    const tx = await program.methods
      .createAsset(
        "streak_days_3",
        userData.follower_count,
        userData.dscvr_points,
        userData.streak.day_count,
        "test_user",
      )
      .accounts({
        signer: wallet.publicKey,
        payer: wallet.publicKey,
        asset: asset.publicKey,
        database: database.publicKey,
  
      })
      .signers([wallet.payer,asset])
      .rpc();

    console.log("Create Asset Transaction:", tx);
    await fetchAndLogDatabaseAccount(); // Log data after creating the asset
  });

  // it("Fetch Database Account", async () => {
  //   // Fetch the database account using getProgramAccounts
  //   const accounts = await connection.getProgramAccounts(
  //     program.programId
  //   );

  //   console.log(`Found ${accounts.length} database account(s)`);
  //   accounts.forEach((account, index) => {
  //     console.log(`Account ${index + 1}:`);
  //     console.log(`Pubkey: ${account.pubkey.toBase58()}`);
  //     console.log(`Lamports: ${account.account.lamports}`);
  //     console.log(`Owner: ${account.account.owner.toBase58()}`);
  //     console.log(`Data Length: ${JSON.stringify(account.account.data, null, 2)}`);
  //   });
  // });
});
