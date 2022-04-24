import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Asd } from "../target/types/asd";

const assert = require("assert");

describe("asd", () => {
  const provider = anchor.AnchorProvider.local();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const program = anchor.workspace.Asd as Program<Asd>;
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
      program.programId

    );
    // Add your test here.
    const tx = await program.rpc.initialize({accounts: {
      storedData: storedData,
      signer: keyPair.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [keyPair]
  },
);
    console.log("Your transaction signature", tx);
  });
});
