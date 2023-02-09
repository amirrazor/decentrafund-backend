const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? //if yes then skip
    describe.skip
  : //otherwise run the following
    describe("Fund", () => {
      let fund;
      let mockV3Aggregator;
      let deployer;
      const sendValue = ethers.utils.parseEther("1"); //1 eth
      beforeEach(async () => {
        //in beforeEach we deploy the Fund contract first before starting to test
        // const accounts = await ethers.getSigners();
        // const accountsZero = accounts[0];
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fund = await ethers.getContract("Fund", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", () => {
        it("sets the aggregator addresses correctly.", async () => {
          const response = await fund.priceFeed();
          assert.equal(response, mockV3Aggregator.address);
        });
      });

      describe("sendFundsFunction", () => {
        it("fails if you don't send enough eth", async () => {
          await expect(fund.sendFunds()).to.be.revertedWith(
            "Not enough funds!"
          );
        });
        it("should send 1 eth and equal funderToMoney", async () => {
          await fund.sendFunds({ value: sendValue });
          const response = await fund.funderToMoney(deployer);
          assert.equal(response.toString(), sendValue.toString());
        });
        it("should test to see if latest funder equals array pushed funder", async () => {
          await fund.sendFunds({ from: deployer, value: sendValue });
          const response = await fund.funders([0]);
          assert.equal(response, deployer);
        });
        it("calls sendFund function when fallback is called", async () => {
          await fund.fallback({ value: sendValue });
          const response = await fund.funders([0]);
          assert.equal(response, deployer);
        });
      });
      describe("onlyManager", () => {
        it("proves only manager modifier works", async () => {
          const response = await fund.i_manager();
          assert.equal(response, deployer);
        });
      });
      describe("withdrawFunds", () => {
        beforeEach(async () => {
          await fund.sendFunds({ value: sendValue });
        });
        it("manager can call withdrawFunds function", async () => {
          const response = await fund.withdrawFunds();
          console.log(response.from);
          console.log(deployer);
          assert.equal(response.from, deployer);
        });
        it("can withdraw from a single funder", async () => {
          //Arrange
          const startingFundContractBalance = await fund.provider.getBalance(
            fund.address
          );
          console.log(startingFundContractBalance.toString());
          const startingFunderBalance = await fund.provider.getBalance(
            deployer
          );
          console.log(startingFunderBalance.toString());
          //Act
          const transactionResponse = await fund.withdrawFunds();
          const transactionReceipt = await transactionResponse.wait(1);
          console.log(transactionReceipt);
          const gasCost =
            transactionReceipt.cumulativeGasUsed *
            transactionReceipt.effectiveGasPrice;

          const endingFundContractBalance = await fund.provider.getBalance(
            fund.address
          );
          console.log(endingFundContractBalance.toString());
          const endingFunderBalance = await fund.provider.getBalance(deployer);
          console.log(endingFunderBalance.toString());
          //Assert
          assert.equal(endingFundContractBalance, 0);
          assert.equal(
            startingFunderBalance.add(startingFundContractBalance).toString(),
            endingFunderBalance.add(gasCost).toString()
          );
        });
        it("can withdraw from a multiple funders", async () => {
          //Arrange
          const accounts = await ethers.getSigners();
          for (i = 1; i < 6; i++) {
            const fundConnectedContract = await fund.connect(accounts[i]);
            const sentFrom = await fundConnectedContract.sendFunds({
              value: sendValue,
            });
            console.log(sentFrom.from);
          }
          const startingFundContractBalance = await fund.provider.getBalance(
            fund.address
          );
          const startingFunderBalance = await fund.provider.getBalance(
            deployer
          );
          console.log(deployer);

          //Act
          const transactionResponse = await fund.withdrawFunds();
          const transactionReceipt = await transactionResponse.wait(1);
          const gasCost =
            transactionReceipt.cumulativeGasUsed *
            transactionReceipt.effectiveGasPrice;
          const endingFundContractBalance = await fund.provider.getBalance(
            fund.address
          );
          const endingFunderBalance = await fund.provider.getBalance(deployer);
          //Assert
          assert.equal(endingFundContractBalance, 0);
          assert.equal(
            startingFunderBalance.add(startingFundContractBalance).toString(),
            endingFunderBalance.add(gasCost).toString()
          );
          await expect(fund.funders(0)).to.be.reverted;

          for (i = 0; i < 6; i++) {
            assert.equal(await fund.funderToMoney(accounts[i].address), 0);
          }
        });
        it("only manager is able to withdraw", async () => {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const attackerConnectedContract = await fund.connect(attacker);
          await expect(attackerConnectedContract.withdrawFunds()).to.be
            .reverted;
        });
      });
    });
