require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = process.env.MNEMONIC || "";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: { phrase: mnemonic },
          providerOrUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
        }),
      network_id: 11155111,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.5.16",
    },
  },
};
