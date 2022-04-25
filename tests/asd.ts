import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Asd } from "../target/types/asd";
import { AsdPuppet } from "../target/types/asd_puppet";

const assert = require("assert");

describe("asd", () => {
  const provider = anchor.AnchorProvider.local();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const programAsd = anchor.workspace.Asd as Program<Asd>;
  const programAsdPuppet = anchor.workspace.Asd as Program<AsdPuppet>;
  const keyPair = anchor.web3.Keypair.generate();


  it("Funds the user", async() => {
    // gotta fund keyPair
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        keyPair.publicKey,
        10000000000
      ),
      "confirmed"
    );

    const userBalance = await provider.connection.getBalance(keyPair.publicKey);
    assert.strictEqual(10000000000, userBalance );

  });

  it("Is initialized!", async () => {
    const [storedData, _] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("data")],
      programAsd.programId

    );
    // Add your test here.
    const tx = await programAsd.rpc.initialize({accounts: {
      storedData: storedData,
      signer: keyPair.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [keyPair]
    },
  );
    console.log("Your transaction signature", tx);
  });

  it("Set CPI data!", async () => {
    const [dataAcc, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("data")],
      programAsd.programId

    );
    // Add your test here.
    const tx = await programAsd.methods.setDataCpi(bump, new anchor.BN(101)).accounts({
      dataAcc: dataAcc,
      // calleeAuthority: keyPair.publicKey,
      asdPuppet: programAsdPuppet.programId,
      }).signers([]);
    // console.log("Your transaction signature", tx);
    console.log(programAsdPuppet.account.data);
    // let checkACcount = await programAsdPuppet.account.data.fetch(dataAcc);
    // assert.strictEqual(checkACcount.num,  new anchor.BN(101) );

  });


});
