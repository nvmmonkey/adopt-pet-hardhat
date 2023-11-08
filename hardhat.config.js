require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
// require("@nomicfoundation/har")
// require("@nomiclabs/hardhat-ethers");
// require("@nomiclabs/hardhat-etherscan");
const keys = require("./keys.json");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {},
    polygon_Mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [keys.DEPLOY_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      polygon_Mumbai: keys.POLYGON_API_KEY,
    },
    customChains: [
      {
        network: "polygon_Mumbai",
        chainId: 80001,
        urls: {
          apiURL: "https://api-testnet.polygonscan.com/api",
          browserURL:"https://mumbai.polygonscan.com/"
        },
      },
    ],
  },

  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: false,
  },
  solidity: {
    version: "0.8.19",

    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

// Verify Programatically on Mumbai constructor argument for PetIndex is %
//npx hardhat verify --network polygon_Mumbai 0x9DCB0BA7e17db8d45AaC5F30484e22E4175497E0 5       