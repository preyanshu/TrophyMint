import React, { useEffect } from "react";
import idl from "./idl.json";
import {
    PublicKey,
    clusterApiUrl,
    Connection,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import {
    AnchorProvider,
    Program,
} from "@coral-xyz/anchor";
import { Buffer } from "buffer";
import useCanvasWallet from "./CanvasWalletProvider";
// import "dotenv/config";
import {db} from "./config";

window.Buffer = Buffer;
import BN from 'bn.js';

export const MintData1 = ({ setMintData }) => {
    
    const { walletAddress, signTransaction, isSuccess } = useCanvasWallet();
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    function parseBN(data) {
        return new BN(data.words, 10, 'le').toNumber();
      }

    async function init() {
        try {
            if (!walletAddress) {
                console.error("Wallet address is not available");
                return;
            }

            const provider = new AnchorProvider(connection, {
                publicKey: new PublicKey(walletAddress),
                signTransaction,
              }, {
                commitment: "confirmed",
              });

            const program = new Program(idl, provider);

            const res = await program.account.database.fetch(
                new PublicKey(db)
            );
             res.achievements.forEach(achievement => {
                const currentCount = parseBN(achievement.currentCount);
                const maxNftCap = parseBN(achievement.maxNftCap);

                achievement.currentCount = currentCount;
                achievement.maxNftCap = maxNftCap;
                
                console.log(`Achievement: ${achievement.name}`);
                console.log(`Current Count: ${currentCount}`);
                console.log(`Max NFT Cap: ${maxNftCap}`);
              });
            console.log("Fetched data:", res);
            setMintData(res);
        } catch (error) {
            console.error("Error initializing program:", error);
        }
    }

    useEffect(() => {
        if (walletAddress) {
            init();
        }
    }, [walletAddress, isSuccess]);

    return <div></div>;
};
