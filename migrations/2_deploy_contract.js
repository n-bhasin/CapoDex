const Dex = artifacts.require("Dex");
const Bat = artifacts.require("mocks/Bat");
const Rep = artifacts.require("mocks/Rep");
const Zrx = artifacts.require("mocks/Zrx");
const Dai = artifacts.require("mocks/Dai");

//converting tickers into bytes
const [DAI, BAT, REP, ZRX] = ["DAI", "BAT", "REP", "ZRX"].map((ticker) =>
  web3.utils.fromAscii(ticker)
);

const SIDE = {
  BUY: 0,
  SELL: 1,
};

module.exports = async (deployer, _network, accounts) => {
  const [trader1, trader2, trader3, trader4] = [
    accounts[0],
    accounts[1],
    accounts[2],
    accounts[3],
  ];

  await Promise.all(
    [Dex, Bat, Rep, Zrx, Dai].map((contract) => deployer.deploy(contract))
  );

  //creating a contract instance to addTokens
  const [dex, bat, rep, zrx, dai] = await Promise.all(
    [Dex, Bat, Rep, Zrx, Dai].map((contract) => contract.deployed())
  );

  await Promise.all([
    dex.addToken(DAI, dai.address),
    dex.addToken(BAT, bat.address),
    dex.addToken(REP, rep.address),
    dex.addToken(ZRX, zrx.address),
  ]);

  const result = await dex.tickers();
  console.log(result);
  const tokens = await dex.getTokens();
  console.log("tokens", tokens);
  //its itme to mint the tokens and approve them by dex address
  const tokenAmountToMint = web3.utils.toWei("1000");
  const seedTokenBalance = async (token, trader) => {
    await token.faucet(trader, tokenAmountToMint);
    await token.approve(dex.address, tokenAmountToMint, { from: trader });

    //deposit the token to dex's wallet for future trades

    const ticker = await token.symbol();
    const tickerHex = web3.utils.padRight(web3.utils.fromAscii(ticker), 64);
    console.log(`*********`);
    console.log(ticker);
    const tx = await dex.deposit(tokenAmountToMint, tickerHex, {
      from: trader,
    });
    // console.log(tx);
    console.log("**********deposited**********");
  };

  //trader 1 will mint the tokens
  await Promise.all(
    [dai, bat, rep, zrx].map((tokens) => seedTokenBalance(tokens, trader1))
  );

  //trader 2 will mint the tokens
  await Promise.all(
    [dai, bat, rep, zrx].map((tokens) => seedTokenBalance(tokens, trader2))
  );

  //trader 3 will mint the tokens
  await Promise.all(
    [dai, bat, rep, zrx].map((tokens) => seedTokenBalance(tokens, trader3))
  );

  //trader 4 will mint the tokens
  await Promise.all(
    [dai, bat, rep, zrx].map((tokens) => seedTokenBalance(tokens, trader4))
  );

  const balance = await dai.balanceOf(trader1);
  console.log("DAI BALANCE:", balance, trader1);
  const dexBalance = await dex.traderBalances(trader1, DAI);
  console.log("dexBalance", dexBalance);
  //we will increase the evmTime deliberately to
  //delay the orders and have some real market feel

  const increaseTime = async (seconds) => {
    await web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [seconds],
        id: 0,
      },
      () => {}
    );
    await web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        params: [],
        id: 0,
      },
      () => {}
    );
  };

  //create some trades and order
  //create trades
  //   await dex.createlimitOrders(BAT, 1000, 10, SIDE.BUY, { from: trader1 });
  //   await dex.createMarketOrder(BAT, 1000, SIDE.SELL, { from: trader2 });
  //   await increaseTime(1);
  //   await dex.createlimitOrders(BAT, 1200, 11, SIDE.BUY, { from: trader1 });
  //   await dex.createMarketOrder(BAT, 1200, SIDE.SELL, { from: trader2 });
  //   await increaseTime(1);
  //   await dex.createlimitOrders(BAT, 1200, 15, SIDE.BUY, { from: trader1 });
  //   await dex.createMarketOrder(BAT, 1200, SIDE.SELL, { from: trader2 });
  //   await increaseTime(1);
  //   await dex.createlimitOrders(BAT, 1500, 14, SIDE.BUY, { from: trader1 });
  //   await dex.createMarketOrder(BAT, 1500, SIDE.SELL, { from: trader2 });
  //   await increaseTime(1);
  //   await dex.createlimitOrders(BAT, 2000, 12, SIDE.BUY, { from: trader1 });
  //   await dex.createMarketOrder(BAT, 2000, SIDE.SELL, { from: trader2 });

  //   await dex.createlimitOrders(REP, 1000, 2, SIDE.BUY, { from: trader1 });
  //   await dex.createMarketOrder(REP, 1000, SIDE.SELL, { from: trader2 });
  //   await increaseTime(1);
  //   await dex.createlimitOrders(REP, 500, 4, SIDE.BUY, { from: trader1 });
  //   await dex.createMarketOrder(REP, 500, SIDE.SELL, { from: trader2 });
  //   await increaseTime(1);
  //   await dex.createlimitOrders(REP, 800, 2, SIDE.BUY, { from: trader1 });
  //   await dex.createMarketOrder(REP, 800, SIDE.SELL, { from: trader2 });
  //   await increaseTime(1);
  //   await dex.createlimitOrders(REP, 1200, 6, SIDE.BUY, { from: trader1 });
  //   await dex.createMarketOrder(REP, 1200, SIDE.SELL, { from: trader2 });

  //   //create orders
  //   await Promise.all([
  //     dex.createlimitOrders(BAT, 1400, 10, SIDE.BUY, { from: trader1 }),
  //     dex.createlimitOrders(BAT, 1200, 11, SIDE.BUY, { from: trader2 }),
  //     dex.createlimitOrders(BAT, 1000, 12, SIDE.BUY, { from: trader2 }),

  //     dex.createlimitOrders(REP, 3000, 4, SIDE.BUY, { from: trader1 }),
  //     dex.createlimitOrders(REP, 2000, 5, SIDE.BUY, { from: trader1 }),
  //     dex.createlimitOrders(REP, 500, 6, SIDE.BUY, { from: trader2 }),

  //     dex.createlimitOrders(ZRX, 4000, 12, SIDE.BUY, { from: trader1 }),
  //     dex.createlimitOrders(ZRX, 3000, 13, SIDE.BUY, { from: trader1 }),
  //     dex.createlimitOrders(ZRX, 500, 14, SIDE.BUY, { from: trader2 }),

  //     dex.createlimitOrders(BAT, 2000, 16, SIDE.SELL, { from: trader3 }),
  //     dex.createlimitOrders(BAT, 3000, 15, SIDE.SELL, { from: trader4 }),
  //     dex.createlimitOrders(BAT, 500, 14, SIDE.SELL, { from: trader4 }),

  //     dex.createlimitOrders(REP, 4000, 10, SIDE.SELL, { from: trader3 }),
  //     dex.createlimitOrders(REP, 2000, 9, SIDE.SELL, { from: trader3 }),
  //     dex.createlimitOrders(REP, 800, 8, SIDE.SELL, { from: trader4 }),

  //     dex.createlimitOrders(ZRX, 1500, 23, SIDE.SELL, { from: trader3 }),
  //     dex.createlimitOrders(ZRX, 1200, 22, SIDE.SELL, { from: trader3 }),
  //     dex.createlimitOrders(ZRX, 900, 21, SIDE.SELL, { from: trader4 }),
  //   ]);
};
