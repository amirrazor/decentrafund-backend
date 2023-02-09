// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PriceConverter.sol";

contract Fund {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 2 * 1e18;
    address[] public funders;
    mapping(address => uint256) public funderToMoney;
    address public immutable i_manager;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        i_manager = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function sendFunds() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "Not enough funds!"
        );
        funders.push(msg.sender);
        funderToMoney[msg.sender] += msg.value;
    }

    function withdrawFunds() public onlyManager {
        for (
            uint256 fundersIndex = 0;
            fundersIndex < funders.length;
            fundersIndex++
        ) {
            address funder = funders[fundersIndex];
            funderToMoney[funder] = 0;
        }
        funders = new address[](0);
        //payable(msg.sender).transfer(address(this).balance);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed!");
    }

    modifier onlyManager() {
        _;
        require(msg.sender == i_manager, "You are not the manager!");
    }

    receive() external payable {
        sendFunds();
    }

    fallback() external payable {
        sendFunds();
    }
}
