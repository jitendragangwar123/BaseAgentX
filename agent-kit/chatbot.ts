import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import Web3 from "web3";
import dotenv from "dotenv";
import { AbiItem } from "web3-utils";
import KlimaTokenABI from "../abi/klima_token.json";
import KlimaPoolABI from "../abi/klima_pool.json";
import * as fs from "fs";
import * as readline from "readline";

dotenv.config();

const ENV = {
  RPC_URL: process.env.RPC_URL!,
  PRIVATE_KEY: process.env.PRIVATE_KEY!,
  WALLET_ADDRESS: process.env.WALLET_ADDRESS!,
  KLIMA_TOKEN_ADDRESS: process.env.KLIMA_TOKEN_ADDRESS!,
  KLIMA_POOL_ADDRESS: process.env.KLIMA_POOL_ADDRESS!,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  CDP_API_KEY_NAME: process.env.CDP_API_KEY_NAME!,
  CDP_API_KEY_PRIVATE_KEY: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
    /\n/g,
    "\n"
  ),
  NETWORK_ID: process.env.NETWORK_ID || "base-sepolia",
};

const web3 = new Web3(new Web3.providers.HttpProvider(ENV.RPC_URL));
const klimaToken = new web3.eth.Contract(
  KlimaTokenABI as AbiItem[],
  ENV.KLIMA_TOKEN_ADDRESS
);
const klimaPool = new web3.eth.Contract(
  KlimaPoolABI as AbiItem[],
  ENV.KLIMA_POOL_ADDRESS
);

async function sendTransaction(to: string, data: string): Promise<string> {
  try {
    const gas = await web3.eth.estimateGas({ to, data });
    const tx = { to, data, gas };
    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      ENV.PRIVATE_KEY
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction!
    );
    return `Transaction successful. TxHash: ${receipt.transactionHash}`;
  } catch (error) {
    console.error("Transaction error:", error);
    throw new Error("Transaction failed");
  }
}

export async function getBalance(address: string): Promise<string> {
  const balance: any = await klimaToken.methods.balanceOf(address).call();
  return `Current KLIMA Balance: ${web3.utils.fromWei(balance, "ether")}`;
}

export async function transferKLIMA(
  amount: string,
  recipient: string
): Promise<string> {
  return sendTransaction(
    ENV.KLIMA_TOKEN_ADDRESS,
    klimaToken.methods
      .transfer(recipient, web3.utils.toWei(amount, "ether"))
      .encodeABI()
  );
}

export async function stakeKLIMA(amount: string): Promise<string> {
  return sendTransaction(
    ENV.KLIMA_POOL_ADDRESS,
    klimaPool.methods.stake(web3.utils.toWei(amount, "ether")).encodeABI()
  );
}

export async function unstakeKLIMA(amount: string): Promise<string> {
  return sendTransaction(
    ENV.KLIMA_POOL_ADDRESS,
    klimaPool.methods.unstake(web3.utils.toWei(amount, "ether")).encodeABI()
  );
}

export function getStrategy(
  type: "bearish" | "buffet" | "bullish" | "moon"
): string {
  const strategies = {
    bearish: [
      "Stake KLIMA in KlimaDAO's staking pool for rebasing rewards",
      "Provide liquidity in KLIMA/USDC pair on SushiSwap",
    ],
    buffet: [
      "Stake KLIMA and claim rewards periodically to reinvest",
      "Convert KLIMA rewards into carbon credits and reinvest",
    ],
    bullish: [
      "Buy more KLIMA during dips and stake",
      "Leverage KLIMA holdings to borrow stablecoins and reinvest",
    ],
    moon: [
      "Borrow stablecoins using KLIMA as collateral and buy more KLIMA",
      "Participate in governance and vote on high-yield KlimaDAO proposals",
    ],
  };
  return `${type.charAt(0).toUpperCase() + type.slice(1)} Strategy: ${
    strategies[type][Math.floor(Math.random() * 2)]
  }`;
}

export async function initializeAgent() {
  try {
    const walletData = fs.existsSync("wallet_data.txt")
      ? fs.readFileSync("wallet_data.txt", "utf8")
      : null;
    const config = {
      apiKeyName: ENV.CDP_API_KEY_NAME,
      apiKeyPrivateKey: ENV.CDP_API_KEY_PRIVATE_KEY,
      cdpWalletData: walletData || undefined,
      networkId: ENV.NETWORK_ID,
    };

    const walletProvider = await CdpWalletProvider.configureWithWallet(config);
    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        pythActionProvider(),
        walletActionProvider(),
        erc20ActionProvider(),
        cdpApiActionProvider({
          apiKeyName: ENV.CDP_API_KEY_NAME,
          apiKeyPrivateKey: ENV.CDP_API_KEY_PRIVATE_KEY,
        }),
        cdpWalletActionProvider({
          apiKeyName: ENV.CDP_API_KEY_NAME,
          apiKeyPrivateKey: ENV.CDP_API_KEY_PRIVATE_KEY,
        }),
      ],
    });

    const tools = await getLangChainTools(agentkit);
    const memory = new MemorySaver();
    const agent = createReactAgent({
      llm: new ChatOpenAI({ model: "gpt-4o-mini" }),
      tools,
      checkpointSaver: memory,
    });

    fs.writeFileSync(
      "wallet_data.txt",
      JSON.stringify(await walletProvider.exportWallet())
    );
    return {
      agent,
      config: { configurable: { thread_id: "CDP AgentKit Chatbot" } },
    };
  } catch (error) {
    console.error("Agent initialization failed:", error);
    throw error;
  }
}
