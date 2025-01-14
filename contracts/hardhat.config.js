require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.21",
  networks: {
    PolygonzkEVMCardonaTestnet : {
      url : 'https://polygonzkevm-cardona.g.alchemy.com/v2/3mJdpJVp8mJ4IF2Ws2RHAuBjZEjaykiT',
      accounts : ['bafdaebf810e1931929b0104422c196d4f291367b55689b5d403395e7f485da3']
    }
  }
};
