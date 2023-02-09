const {
  networkConfig,
  developmentChains,
  DECIMAL,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId == "31337") {
    log("local network chosen. Deploying mocks!");
    await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMAL, INITIAL_ANSWER],
    });
    log("mock deployed!");
  }
};

module.exports.tags = ["all", "mocks"];
