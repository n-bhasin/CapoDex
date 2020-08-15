import React, { useEffect } from "react";
import "../App.css";
// import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import Navbar from "./navbar";
import Wallet from "./wallet";
import Trades from "./trades";
import { ToastContainer, toast } from "react-toastify";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
// }));

export default function Home({ web3, contracts, accounts }) {
  const [tokens, setTokens] = React.useState(["DAI"]);
  const [orders, setOrders] = React.useState({
    buy: [],
    sell: [],
  });

  const [trades, setTrades] = React.useState([]);
  const [listener, setListener] = React.useState(undefined);
  //user will have all req. parameters
  const [user, setUser] = React.useState({
    accounts: [],
    balances: { tokenDex: 0, tokenWallet: 0 },
    selectedToken: "undefined",
  });

  //listen to trades

  const listenToTrades = (token) => {
    const tradeIds = new Set();
    setTrades([]);
    const listener = contracts.dex.events
      .NewTrade({
        filter: { ticker: web3.utils.fromAscii(token.ticker) },
        fromBlock: 0,
      })
      .on("data", (newTrade) => {
        if (tradeIds.has(newTrade.returnValues.tradeId)) return;
        tradeIds.add(newTrade.returnValues.tradeId);
        setTrades((trades) => [...trades, newTrade.returnValues]);
      });
    setListener(listener);
  };

  //get all balances
  const getBalance = async (account, token) => {
    const bytesTicker = web3.utils.fromAscii(token.ticker);
    // console.log("line35:", token[0]);
    //alert(bytesTicker);
    const tokenDex = web3.utils.fromWei(
      await contracts.dex.methods.traderBalances(account, bytesTicker).call()
    );
    console.log("tokenDex", tokenDex, account, token);
    const symbol = token.ticker;

    const tokenWallet = web3.utils.fromWei(
      await contracts[symbol].methods.balanceOf(account).call(),
      "ether"
    );

    return { tokenDex, tokenWallet };
  };

  //deposit tokens into dex to trade
  const deposit = async (amount) => {
    const ticker = web3.utils.fromAscii(user.selectedToken.ticker);
    //need to get approval from user to deposit funds on the behalf of user
    await contracts[user.selectedToken.ticker].methods.approve(
      contracts.dex.options.address,
      amount
    );
    //now call the deposit
    await contracts.dex.methods
      .deposit(amount, ticker)
      .send({ from: user.accounts[0] });
    const balances = await getBalance(user.accounts[0], user.selectedToken);
    setUser((user) => ({ ...user, balances }));
  };

  //withdraw tokens to wallet
  const withdraw = async (amount) => {
    const ticker = web3.utils.fromAscii(user.selectedToken.ticker);
    const toWei = web3.utils.toWei(amount);
    //now call the withdrawal
    await contracts.dex.methods
      .withdrawal(toWei, ticker)
      .send({ from: user.accounts[0], gas: 3000000 });
    const balances = await getBalance(user.accounts[0], user.selectedToken);
    setUser((user) => ({ ...user, balances }));
  };

  //get all orders
  const getOrders = async (token) => {
    console.log("line80", token.ticker);
    const { data } = await Axios.get(
      `http://localhost:4000/orders/${token[0]}`
    );

    if (data.allOrders === []) {
      return "No orders";
    } else {
      // for (let i = 0; i < data.allOrders.length; i++) {
      //   web3.utils.hexToUtf8(data.[i].ticker);
      //      }

      return {
        all: data.all,
        buy: data.buyOrder,
        sell: data.sellOrder,
      };
    }
  };
  const createLimitOrder = async (amount, price, side) => {
    const byteValueTicker = web3.utils.fromAscii(user.selectedToken.ticker);
    // const updatedPrice = web3.utils.toWei(price);
    const order = {
      trader: accounts[0],
      amount: parseInt(amount),
      ticker: user.selectedToken[0],
      side: side,
      filled: 0,
      price: parseInt(price),
      date: new Date(),
      signature: "",
    };

    let message = {
      trader: accounts[0],
      amount: parseInt(amount),
      ticker: user.selectedToken[0],
      side: side,
      price: parseInt(price),
    };
    const hashedData = web3.utils.soliditySha3(message);
    console.log("hashedData", hashedData);

    const sig = await web3.eth.sign(hashedData, accounts[0]);
    console.log(sig);

    //after match->who is going to pay the tx cost:?
    //
    order.signature = sig;
    const { data } = await Axios.post("http://localhost:4000/orders", {
      order,
    });
    console.log(data.message);
    toast.success(data.message);
    const newOrders = await getOrders(user.selectedToken);
    setOrders(newOrders);
  };

  const createMarketOrder = async (amount, side) => {
    //retrieving the orders of other side to match
    if (side === "BUY") {
      side = "SELL";
    } else {
      side = "BUY";
    }

    const { data } = await Axios.get(
      `http://localhost:4000/ordersBySide/${user.selectedToken[0]}/${side}`
    );
    //order matching logic
    let i = 0;
    let remaining = parseInt(amount);
    let abc = [];
    while (i < data.orders.length && remaining > 0) {
      const available =
        parseInt(data.orders[i].amount) - parseInt(data.orders[i].filled);
      const matched = remaining > available ? available : remaining;
      remaining = remaining - matched;
      data.orders[i].filled =
        parseInt(data.orders[i].filled) + parseInt(matched);

      //updating the filled orders
      const updateOrder = data.orders[i];
      const result = await Axios.put(
        `http://localhost:4000/updateConfirmedOrders`,
        {
          updateOrder,
        }
      );

      setTimeout(() => {
        console.log(result.message);

        i++;
      }, 54);
    }

    //Deleting all confirmed orders from DB
    for (let i = 0; i < data.orders.length; i++) {
      if (data.orders[i].filled === data.orders[i].amount) {
        let { ticker, trader, amount, side, filled, price, date } = data.orders[
          i
        ];
        if (side === "BUY") {
          side = 0;
        } else {
          side = 1;
        }
        //alert(side);
        //  const toWei = web3.utils.toWei(price);
        await contracts.dex.methods
          .createMarketOrder(trader, amount, ticker, side, filled, price)
          .send({ from: user.accounts[0], gas: 3000000 });
        await Axios.delete(
          `http://localhost:4000/deleteConfirmedOrders/${data.orders[i]._id}`
        );
        // alert(data.message);
      }
      // alert("Order confirmed");
      const balances = await getBalance(user.accounts[0], user.selectedToken);
      const newOrders = await getOrders(user.selectedToken);
      setUser((user) => ({ ...user, balances }));
      setOrders(newOrders);
    }
  };
  const selectToken = (token) => {
    setUser({ ...user, selectedToken: token });
  };
  useEffect(() => {
    const init = async () => {
      //get the tokens when component renders
      const rawTokens = await contracts.dex.methods.getTokens().call();
      console.log("rawTokens", rawTokens);

      //need to convert the ticker int utf8
      const tokens = rawTokens.map((token) => ({
        ...token,
        ticker: web3.utils.hexToUtf8(token[0]),
      }));
      console.log("In home filetokens", tokens);

      const [balances, orders] = await Promise.all([
        getBalance(accounts[0], tokens[0]),
        getOrders(tokens[0]),
      ]);
      listenToTrades(tokens[0]);
      setTokens(tokens);
      setUser({ accounts, balances, selectedToken: tokens[0] });
      setOrders(orders);
    };

    init();
  }, []);

  useEffect(
    () => {
      const init = async () => {
        //console.log("line141: ", user.accounts[0], user.selectedToken);
        const userToken = user.selectedToken;

        const [balances, orders] = await Promise.all([
          getBalance(accounts[0], user.selectedToken),
          getOrders(user.selectedToken),
        ]);
        listenToTrades(user.selectedToken);
        setUser((user) => ({ ...user, balances }));
        setOrders(orders);
      };
      if (typeof user.selectedToken !== "undefined") {
        init();
      }
    },
    [user.selectedToken],
    () => {
      listener.unsubscribe();
    }
  );

  useEffect(() => {
    const init = async () => {
      window.ethereum.on("accountsChanged", (accounts) => {
        setUser((user) => ({ ...user, accounts }));
      });
      const [balances, orders] = await Promise.all([
        getBalance(accounts[0], user.selectedToken),
        getOrders(user.selectedToken),
      ]);
      setUser((user) => ({ ...user, balances }));
      setOrders(orders);
    };
    init();
  }, [user.accounts]);
  if (typeof user.selectedToken === "undefined") {
    return alert("Please Select a token!");
  }
  return (
    <React.Fragment>
      <Navbar address={accounts[0]} />
      <main>
        <div className="col-md-12" style={{ paddingTop: 15 }}>
          <div className="row">
            <div className="col-md-9">
              <Trades orders={orders} user={user} web3={web3} trades={trades} />
            </div>

            <div className="col-md-3">
              <Wallet
                user={user}
                deposit={deposit}
                withdraw={withdraw}
                tokens={tokens}
                onSelect={selectToken}
                createLimitOrder={createLimitOrder}
                createMarketOrder={createMarketOrder}
              />
              <hr />
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}
