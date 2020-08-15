# CapoDex - A Decentralized Exchange for ERC20 Tokens(DAppII Capstone Project George Brown College)

### Introduction

A decentralized exchange that is built on ethereum blockchain and allows users to trade ERC20 tokens like BAT, ZRX, REP where quote currency is DAI. All these assets will be governed by users themselves like their private keys and funds.

<u>NO MORE PERSONAL INFORMATION SHARING</u>

### Author

```
Name: Neeraj Bhasin
```

StudentId: 101263021

```
EmailId: nkbhasin28@gmail.com
```

### Problem Statement

The problem that we have with centralized exchanges is that before start trading they ask us to submit KYCs (know your customer) to verify the user. With the submission of these KYC documentation we subnmit all our personal information like name, phone number, email id, bank details, address. Eventually which becomes a honey pot hacker as it is a single source of storage.

### Proposed Solution

The key to solve this problem is Blockchain. By using blockchain technology we will get a decentralized platform where every onboarded user would be anonymous and none of the user details will be stored within the exchange. With this user will have 3 top benefits:

1.  No Centralization
2.  Control Over Funds
3.  Security

![](/documentation/solution.png "solution")

### Design Architecture

#### Technology

##### Ethereum

Ethereum is an open source, public, blockchain-based distributed computing platform and operating system featuring smart contract functionality.

##### ReactJS

React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.

##### MongoDB

MongoDB is a cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas

### Modeling Diagrams

##### Sequence Diagram

A three layer architecture which explains about the response and resques model,

![](/documentation/sequenceDiagram.png "sequenceDiagram")

##### Class Diagram

It gives the higher level of knowledge of how Smart Contracts will communicate and which kind of functions they're using.

![](/documentation/ClassDiagram.png "ClassDiagram")

##### Off-Chain Orderbook

All the orders will be cost free and stored in database with the help of mongoDB.

![](/documentation/offchainOrderbook.png "offchainOrderbook")

### Data Storage

##### Dex.sol

| Function Name | Visibility | Type(pure/view/payable | Modifiers                                  | Parameters                              | Action-Notes                                                                          |
| ------------- | ---------- | ---------------------- | ------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------- |
| getToken      | External   | View -                 | -It returns all the available tokens added |
| addToken      | external   | -                      | onlyAdmin                                  | (bytes32 ticker, address, tokenAddress) | -it adds the token to mapping -push ticker to the array of tickers: tokenList`        |
| deposit       | external   | -                      | tokenExist                                 | (uint amount, bytes32 ticker)           | -sends the tokens to contract address by using the transferFrom() of IERC20 template. |

-update the use balance using mapping
withdrawal | external | - | tokenExist | (uint amount, bytes32 ticker) | -checks the use balance
-update the use balance using mapping
-transfer the funds to user’s address using transfer function of IERC20 template.

#### BAT.sol, REP.sol, ZRX.sol, DAI.sol

| Function Name             | Visibility | Type(pure/view/payable | Modifiers                    | Parameters                 | Action-Notes      |
| ------------------------- | ---------- | ---------------------- | ---------------------------- | -------------------------- | ----------------- |
| faucet                    | external   | -                      | -                            | (address to, uint amount)  | -mints the tokens |
| Constructor, ERC20 public | -          | -                      | (string name, string symbol) | -takes the name and symbol | of token          |

##### Offchain

Orderbook Parameters that are going to store offchain.

| Name       | Type             |
| ---------- | ---------------- |
| trader:    | { type: String } |
| amount:    | { type: Number } |
| ticker:    | { type: String } |
| side:      | { type: String } |
| filled:    | { type: Number } |
| price:     | { type: Number } |
| date:      | { type: String}  |
| signature: | { type: String } |

### Resources

- Etherdelta
- 0x Protocol
