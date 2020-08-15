// import { ethers } from "ethers";
// import Web3 from "web3";
// import Demo from "../contracts/Demo.json";

// let provider, signer, contract;
// // const getWeb3 = () => {
// //   return new Promise((resolve, reject) => {
// //     // Wait for loading completion to avoid race conditions with web3 injection timing.
// //     window.addEventListener("click", async () => {
// //       // Modern dapp browsers...
// //       if (window.ethereum) {
// //         const web3 = new Web3(window.ethereum);
// //         try {
// //           // Request account access if needed
// //           await window.ethereum.enable();
// //           // Acccounts now exposed
// //           resolve(web3);
// //         } catch (error) {
// //           reject(error);
// //         }
// //       }
// //       // Legacy dapp browsers...
// //       else if (window.web3) {
// //         // Use Mist/MetaMask's provider.
// //         const web3 = window.web3;
// //         console.log("Injected web3 detected.");
// //         resolve(web3);
// //       }
// //       // Fallback to localhost; use dev console port by default...
// //       else {
// //         const provider = new Web3.providers.HttpProvider(
// //           "http://localhost:9545"
// //         );
// //         const web3 = new Web3(provider);
// //         console.log("No web3 instance injected, using Local web3.");
// //         resolve(web3);
// //       }
// //     });
// //   });
// // };
// const contractAddress = "0xa15c7F3fb708624e2a9619B4891a3ee688f1c5d4";
// async function getWeb3() {
//   if (typeof window.ethereum !== "undefined") {
//     // console.log(window.ethereum)

//     await window.ethereum.enable();
//     provider = new ethers.providers.Web3Provider(window.ethereum);
//     if (!isLocked()) {
//       signer = provider.getSigner();
//       console.log(signer);
//       contract = new ethers.Contract(
//         Demo.networks[5777].address,
//         Demo.abi,
//         signer
//       );
//       const address = await signer.getAddress();
//       return { message: "ok", signerAddress: address };
//     } else {
//       return "metamask locked";
//     }
//   } else {
//     return "metamask not installed";
//   }
// }

// function isLocked() {
//   if (provider.selectedAddress !== "undefined") {
//     return false;
//   } else {
//     return true;
//   }
// }
// async function sign(hashedData) {
//   let flatsig = await signer.signMessage(hashedData);
//   let sig = ethers.utils.splitSignature(flatsig);
//   return sig;
// }

// function hashData(Obj) {
//   let string = JSON.stringify(Obj);
//   let hex = ethers.utils.hashMessage(string);

//   let hashedData = ethers.utils.keccak256(hex);
//   return hashedData;
// }

// const testingSignature = async (obj) => {
//   // const obj = { ticker: "BAT", side: "BUY", amount: 100 };
//   const hashedData = await hashData(obj);
//   const sig = await sign(hashedData);
//   console.log(sig);
//   return { hashedData, sig };
// };

// const addToBlockchain = async (hashedData, orders) => {
//   console.log("****************");
//   console.log(hashedData);
//   console.log(
//     orders.trader,
//     orders.signature.v,
//     orders.signature.r,
//     orders.signature.s
//   );
//   const tx = await contract.increment(
//     hashedData,
//     orders.trader,
//     orders.signature.v,
//     orders.signature.r,
//     orders.signature.s
//   );
//   // const tx = await contract.verifyTranscript(
//   //   hashedData,
//   //   orders.signature.v,
//   //   orders.signature.r,
//   //   orders.signature.s
//   // );
//   //await tx.wait();
//   console.log("utilsContract:", tx);
// };
// // const getContracts = async (web3) => {
// //   //console.log(web3.eth.net);
// //   const networkId = await web3.eth.net.getId();

// //   const deployedNetwork = Demo.networks[networkId];
// //   const demo = new web3.eth.Contract(
// //     Demo.abi,
// //     deployedNetwork && deployedNetwork.address
// //   );
// //   return demo;
// // };

// // function hashData(obj) {
// //   const hashedData = web3.util;

// //   return hashData;
// // }

// // async function sign(hashedData) {
// //   // let flatsig = await signer.signMessage(hashedData);
// //   // let sig = ethers.utils.splitSignature(flatsig);

// //   return sig;
// // }
// // console.log(signer);
// export { getWeb3, testingSignature, addToBlockchain };
