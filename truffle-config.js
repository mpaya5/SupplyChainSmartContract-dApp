const HDWalletProvider = require("@truffle/hdwallet-provider");
var mnemonic = "YOUR MNEMONIC FROM YOUR WALLET (MetaMask)";


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/xxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      },
      network_id: 3,
      gas: 4500000,
      gasPrice: 100000000000,
    },
    live: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      },
      network_id: 1,
      gas: 750000000,
      gasPrice: 10000000000,
    }
  }
};