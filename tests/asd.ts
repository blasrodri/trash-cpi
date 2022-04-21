import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Asd } from "../target/types/asd";

describe("asd", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Asd as Program<Asd>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
