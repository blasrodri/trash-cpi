import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
// import { Asd } from "../target/types/asd";
// import { AsdPuppet } from "../target/types/asd_puppet";
const PublicKey = require("@solana/web3.js").PublicKey;

const assert = require("assert");

describe("asd", () => {
  const provider = anchor.AnchorProvider.env();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const programAsd = anchor.workspace.Asd;
  const programAsdPuppet = anchor.workspace.AsdPuppet;
  const keyPair = anchor.web3.Keypair.generate();

  it("Funds the user", async () => {
    // gotta fund keyPair
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(keyPair.publicKey, 10000000000),
      "confirmed"
    );

    const userBalance = await provider.connection.getBalance(keyPair.publicKey);
    assert.strictEqual(10000000000, userBalance);
  });

  it("Is initialized!", async () => {
    const [firstPDA, firstBump] = await PublicKey.findProgramAddress(
      [Buffer.from("data"), keyPair.publicKey.toBuffer()],
      programAsd.programId
    );
    // Add your test here.

    //       const tx = await programAsd.rpc.initialize({accounts: {
    //     storedData: storedData,
    //     signer: keyPair.publicKey,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     }, signers:
    //       [keyPair]
    //       });
    //   console.log("Your transaction signature", tx);
    // });

    let tx: any;


    tx = await programAsdPuppet.methods
      .init(firstPDA)
      .accounts({
        puppet: keyPair.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([keyPair])
      .rpc();

    tx = await programAsd.methods.set(firstBump, new anchor.BN(5)).accounts({
      storedData: keyPair.publicKey,
      puppetProgram: programAsdPuppet.programId,
      authority: firstPDA
    }).rpc();

    let data = await programAsdPuppet.account.data.fetch(keyPair.publicKey);
    console.log(data.num.toNumber());


    // tx = await programAsdPuppet.methods
    //   .initialize(firstPDA)
    //   .accounts({
    //     puppet: keyPair.publicKey,
    //     user: provider.wallet.publicKey,
    //   })
    //   .signers[keyPair].rpc();

    // console.log(tx);
  });
});
