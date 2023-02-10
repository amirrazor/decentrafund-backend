# Decentralized fundraising - Backend

## Introduction

Welcome to the "Decentralized Fundraising" project, a decentralized platform that enables individuals and organizations to easily and securely raise funds using smart contracts. The platform is built using the Hardhat development environment and includes both unit tests and staging tests to ensure the quality and security of the code.

The project includes a demo that can be accessed at "https://decentrafund.de", and the smart contract is live on the Goerli test network, using test money only. The decentralized nature of the platform provides transparency and security for all transactions, making it an ideal solution for fundraising campaigns.

If you are interested in learning more about the project, or want to get started, please take a look at the rest of the README file for more information on how to set up the project and start using it. Thank you for your interest!



### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

<a href="https://hardhat.org">Hardhat</a> </br>
<a href="https://docs.ethers.org">Ethers.js</a>



## Getting Started

### Prerequisites

Run yarn to install all the necessary node modules first:
  ```sh
  yarn
  ```
  
The following tasks will get you started with compiling, testing, and deploying the smart contract:

```shell
yarn hardhat compile
yarn hardhat deploy --network goerli
yarn hardhat test
REPORT_GAS=true yarn hardhat test
yarn hardhat node
yarn hardhat run scripts/deploy.js
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>
