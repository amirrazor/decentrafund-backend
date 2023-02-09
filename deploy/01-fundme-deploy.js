const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");

//getNamedAccounts and deployments come from hardhat runtime environment or hre
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  // This if statements says, if the network includes names (hardhat, localhost) then run mocks
  // otherwise deploy using the chosen chain
  //This if statement can also be used: if (chainId == "31337")

  const fund = await deploy("Fund", {
    from: deployer,
    args: [ethUsdPriceFeedAddress], //put price feed address
    log: true,
  });
  log("done......................................");
};

module.exports.tags = ["all", "fund"];
