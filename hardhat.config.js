require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
const keys = require("./keys.json");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {},
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [keys.DEPLOY_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: keys.POLYGON_API_KEY,
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true,
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
