import React, { useState, useEffect } from "react";
import { getWeb3, getContracts } from "./blockchain/web3Utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./components/home";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState("undefined");
  const [accounts, setAccounts] = useState([]);
  const [contracts, setContracts] = useState("undefined");
  // const [loader, setLoader] = useState(false);

  useEffect(() => {
    //listening to metamask and retieving the accounts and contracts
    const init = async () => {
      const web3 = await getWeb3();
      const contracts = await getContracts(web3);
      const accounts = await web3.eth.getAccounts();

      //console.log(contracts);
      // console.log(accounts);
      setWeb3(web3);
      setContracts(contracts);
      setAccounts(accounts);
    };
    init();
    window.ethereum.on("accountsChanged", (accounts) => {
      setAccounts(accounts);
    });
  }, []);

  //checking the status
  const isReady = () => {
    return (
      typeof web3 != "undefined" &&
      typeof contracts != "undefined" &&
      accounts.length >= 0
    );
  };

  return (
    <div className="App">
      <ToastContainer />
      {isReady() && accounts.length > 0 ? (
        <Home web3={web3} contracts={contracts} accounts={accounts} />
      ) : (
        <p>Loading...!</p>
      )}
    </div>
  );
}

export default App;
