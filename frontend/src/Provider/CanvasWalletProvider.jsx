import { useState, useContext, createContext, useEffect } from "react";
import { CanvasClient } from "@dscvr-one/canvas-client-sdk";
import { registerCanvasWallet } from "@dscvr-one/canvas-wallet-adapter";
import { Connection, PublicKey } from "@solana/web3.js";
import { encode } from "bs58";
import { toast } from "react-toastify";

const WalletContext = createContext(null);

const SOLANA_MAINNET_CHAIN_ID = "solana:101";

export const CanvasWalletProvider = ({ children }) => {
  const [canvasClient, setCanvasClient] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletIcon, setWalletIcon] = useState(null);
  const [iframe, setIframe] = useState(false);
  const [userInfo, setUserInfo] = useState(undefined);
  const [content, setContent] = useState(undefined);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const isIframe = () => {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    };

    setIframe(isIframe());

    if (isIframe()) {
      const client = new CanvasClient();
      registerCanvasWallet(client);
      setCanvasClient(client);
      console.log("CanvasClient initialized");
    }
  }, []);

  const connectWallet = async () => {
    if (canvasClient) {
      try {
        const info = await canvasClient.ready();
        if (info?.untrusted) {
          const { user, content } = info.untrusted;
          setUserInfo(user);
          setContent(content);
        } else {
          console.error("Failed to retrieve user information");
        }
        await canvasClient.ready();
        console.log("CanvasClient is ready", canvasClient);

        const response = await canvasClient.connectWallet(
          SOLANA_MAINNET_CHAIN_ID
        );

        if (response?.untrusted?.success) {
          toast.success("Wallet connected", {
            autoClose: 5000,
            closeOnClick: true,
          });
          setWalletAddress(response.untrusted.address);
          setWalletIcon(response.untrusted.walletIcon);
          console.log("Wallet connected:", response.untrusted.address);
        } else {
          toast.error("Failed to connect wallet");
          console.error("Failed to connect wallet");
        }
      } catch (error) {
        toast.error("Error connecting wallet: " + error);
        console.error("Error connecting wallet:", error);
      }
    } else {
      toast.error("CanvasClient is not initialized, can't connect wallet")
      console.error("CanvasClient is not initialized");
    }
  };

  const printSignersPublicKeys = (transaction) => {
    console.log("Transaction Signers:");

    transaction.signatures.forEach((signatureObj, index) => {
      console.log(
        `Signer ${index + 1}: PublicKey - ${signatureObj.publicKey.toString()}`
      );
      if (signatureObj.signature) {
        console.log(
          `Signer ${index + 1}: Signature - ${Buffer.from(
            signatureObj.signature
          ).toString("hex")}`
        );
      } else {
        console.log(`Signer ${index + 1}: Signature - null`);
      }
    });
  };

  // Example usage
  // printSignersPublicKeys(transaction);

  const signTransaction = async (transaction) => {
    if (!canvasClient || !walletAddress) {
      console.error("CanvasClient or walletAddress is not available");
      toast.info("Please connect your wallet first");
      return null;
    }

    console.log("Signing transaction:", transaction);
    printSignersPublicKeys(transaction);

    try {
      const network = "https://api.devnet.solana.com/";
      const connection = new Connection(network, "confirmed");

      // Fetch the latest blockhash

      const { blockhash } = await connection.getLatestBlockhash({
        commitment: "confirmed",
      });

      console.log("Blockhash:", blockhash);
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(walletAddress);

      // Serialize the transaction
      console.log("transaction", transaction);
      // Create a new transaction object by cloning the original one

      const serializedTx = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });
      console.log("seriaize", serializedTx);
      // Encode serialized transaction to base58 if needed
      const base58Tx = encode(serializedTx);

      console.log(base58Tx, "base");

      // Sign and send transaction
      console.log("signing");
      const results = await canvasClient.signAndSendTransaction({
        unsignedTx: base58Tx,
        awaitCommitment: "confirmed",
        chainId: SOLANA_MAINNET_CHAIN_ID,
      });
      console.log("Transaction result:", results);

      if (results?.untrusted?.success) {
        setIsSuccess(true);
        toast.success("Transaction successfull");
        console.log("Transaction signed:", results.untrusted.signedTx);
        return results;
      } else {
        toast.error("Failed to sign transaction", results);
        console.error(
          "Failed to sign transaction:",
          results?.untrusted?.error || "Unknown error"
        );
      }
    } catch (error) {
      toast.error(
        "There may be some issue with networks, please try reloading or try after some time"
      );
      console.error("Error signing transaction:", error);
    }

    return null;
  };

  const signAllTransactions = async (transactions) => {
    if (!canvasClient || !walletAddress) {
      console.error("CanvasClient or walletAddress is not available");
      return null;
    }
    console.log("called");
    try {
      const network =
        process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com/";
      const connection = new Connection(network, "confirmed");

      const signedTransactions = [];

      for (const transaction of transactions) {
        // Fetch the latest blockhash
        const { blockhash } = await connection.getLatestBlockhash({
          commitment: "confirmed",
        });
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = new PublicKey(walletAddress);

        // Serialize the transaction
        const serializedTx = transaction.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        });

        const base58Tx = encode(serializedTx);

        // Sign and send each transaction via canvasClient
        const result = await canvasClient.signAndSendTransaction({
          unsignedTx: base58Tx,
          awaitCommitment: "confirmed",
          chainId: SOLANA_MAINNET_CHAIN_ID,
        });

        if (result?.untrusted?.success) {
          console.log("Transaction signed:", result.untrusted.signedTx);
          signedTransactions.push(result.untrusted.signedTx);
        } else {
          console.error("Failed to sign transaction");
        }
      }
      return signedTransactions;
    } catch (error) {
      console.error("Error signing transactions:", error);
      return null;
    }
  };

  const value = {
    connectWallet,
    walletAddress,
    walletIcon,
    signTransaction,
    isSuccess,
    iframe,
    userInfo,
    content,
    signAllTransactions,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

const useCanvasWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error(
      "useCanvasWallet must be used within a CanvasWalletProvider"
    );
  }
  return context;
};

export default useCanvasWallet;
