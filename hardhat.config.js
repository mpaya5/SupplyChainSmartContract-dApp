require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");
require("dotenv").config();

const { MNEMONIC, INFURA_API_KEY, SEPOLIA_PRIVATE_KEY } = process.env;

const sepoliaUrl = INFURA_API_KEY
  ? `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
  : "https://sepolia.infura.io/v3/";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: sepoliaUrl,
      accounts: SEPOLIA_PRIVATE_KEY
        ? [SEPOLIA_PRIVATE_KEY]
        : MNEMONIC
          ? { mnemonic: MNEMONIC }
          : [],
    },
  },
};
