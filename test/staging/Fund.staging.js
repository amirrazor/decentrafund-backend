const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? //if yes then skip
    describe.skip
  : //otherwise run the following
    describe("Fund", () => {
      let fund;
      let deployer;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fund = await ethers.getContract("Fund", deployer);
      });

      it("allows for funding and withdrawing", async () => {
        await fund.withdrawFunds();
        const endingBalance = await fund.provider.getBalance(fund.address);
        assert.equal(endingBalance.toString(), 0);
      });
    });
