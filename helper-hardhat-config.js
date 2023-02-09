const networkConfig = {
  5: {
    name: "Goerli-Testnet",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
  1: {
    name: "Ethereum-Mainnet",
    ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  },
  137: {
    name: "Polygon-Mainnet",
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
  },
  80001: {
    name: "Mumbai-Testnet",
    ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
  },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMAL = 8;
const INITIAL_ANSWER = 110000000000;

module.exports = {
  networkConfig,
  developmentChains,
  DECIMAL,
  INITIAL_ANSWER,
};
