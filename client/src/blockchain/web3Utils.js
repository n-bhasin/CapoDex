import Web3 from "web3";
import Dex from "../contracts/Dex.json";
import ERC20Abi from "./ERC20abi.json";

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://localhost:7545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });
};

const getContracts = async (web3) => {
  //console.log(web3.eth.net);
  const networkId = await web3.eth.net.getId();

  const deployedNetwork = Dex.networks[networkId];
  const dex = new web3.eth.Contract(
    Dex.abi,
    deployedNetwork && deployedNetwork.address
  );
  console.log("dex", dex.methods);
  const tickers = await dex.methods.tickers().call();
  console.log("tickers()", tickers);
  let allTokens = [];
  for (let i = 0; i < tickers.length; i++) {
    const Tokens = await dex.methods.extractTokens(tickers[i]).call();
    allTokens.push(Tokens);
  }
  console.log(allTokens);

  const updateTokenContracts = allTokens.reduce(
    (acc, token) => ({
      ...acc,
      [web3.utils.hexToUtf8(token[0])]: new web3.eth.Contract(
        ERC20Abi,
        token[1]
      ),
    }),
    {}
  );

  console.log("allTokens line71", updateTokenContracts);
  const tokens = await dex.methods.getTokens().call();
  console.log("tokens()", tokens);

  const tokenContracts = tokens.reduce(
    (acc, token) => ({
      ...acc,
      [web3.utils.hexToUtf8(token.ticker)]: new web3.eth.Contract(
        ERC20Abi,
        token.tokenAddress
      ),
    }),
    {}
  );
  //console.log("tokenContracts", tokenContracts);
  return { dex, ...tokenContracts };
};

export { getWeb3, getContracts };
