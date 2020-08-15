import React, { useState } from "react";
import Dropdown from "./dropdown";
import PlaceOrder from "./placeOrder";
const DIRECTION = { DEPOSIT: "DEPOSIT", WITHDRAW: "WITHDRAW" };
const Wallet = ({
  deposit,
  withdraw,
  user,
  tokens,
  onSelect,
  createLimitOrder,
  createMarketOrder,
}) => {
  console.log("wallet user", user);
  const [direction, setDirection] = useState(DIRECTION.DEPOSIT);
  const [amount, setAmount] = useState(0);

  const onSubmit = (e) => {
    e.preventDefault();
    if (direction === DIRECTION.DEPOSIT) {
      deposit(amount);
    } else {
      withdraw(amount);
    }
  };

  return (
    <div id="wallet" className="card">
      <div className="card-body">
        <div className="col-md-12">
          <Dropdown
            items={tokens.map((token) => ({
              label: token.ticker,
              value: token,
            }))}
            activeItem={{
              label: user.selectedToken.ticker,
              value: user.selectedToken,
            }}
            onSelect={onSelect}
          />
        </div>
        <h5 className="text-left mb3" style={{ marginBottom: "1em" }}>
          Wallet
        </h5>
        {/* wallet balance */}
        <div className="form-group row">
          {/* <label className="col-sm-4 col-form-label" htmlFor="wallet">
            Wallet
          </label> */}
          <div className="col-md-12">
            <div className="input-group mb3">
              <input
                id="contract"
                className="form-control"
                disabled
                value={user.balances.tokenWallet}
              />
              <div className="input-group-append">
                <span className="input-group-text">Wallet</span>
              </div>
            </div>
          </div>
        </div>
        {/* dex balance */}
        <div className="form-group row">
          {/* <label className="col-sm-4 col-form-label" htmlFor="contract">
            Dex
          </label> */}

          <div className="col-md-12">
            <div className="input-group">
              <input
                id="contract"
                className="form-control"
                disabled
                value={user.balances.tokenDex}
              />
              <div className="input-group-append">
                <span className="input-group-text">DEX</span>
              </div>
            </div>
          </div>
        </div>

        {/* transfer */}
        <hr style={{ marginTop: "2em", marginBottom: "2em" }}></hr>
        <h5 className="text-left mb3" style={{ marginBottom: "1em" }}>
          Transfer {user.selectedToken.ticker}
        </h5>
        <form id="transfer" onSubmit={(e) => onSubmit(e)}>
          <div className="form-group row">
            {/* <label htmlFor="direction" className="col-sm-4 ">
              Direction
            </label> */}
            <div className="col-md-12">
              <div id="direction" className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn btn-success ${
                    direction === DIRECTION.DEPOSIT ? "active" : ""
                  }`}
                  onClick={() => setDirection(DIRECTION.DEPOSIT)}
                >
                  DEPOSIT
                </button>
                <button
                  type="button"
                  className={`btn btn-danger ${
                    direction === DIRECTION.WITHDRAW ? "active" : ""
                  }`}
                  onClick={() => setDirection(DIRECTION.WITHDRAW)}
                >
                  WITHDRAW
                </button>
              </div>
            </div>
          </div>

          <div className="form-group row">
            {/* <label htmlFor="amount" className="col-sm-4 col-form-label">
              Amount */}
            {/* </label> */}
            <div className="col-md-12">
              <div className="input-group ">
                <input
                  id="amount"
                  type="text"
                  placeholder="enter the amount"
                  className="form-control"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="input-group-append">
                  <span className="input-group-text">
                    {user.selectedToken.ticker}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary form-control">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="card-body">
        <hr />
        {user.selectedToken.ticker !== "DAI" ? (
          <PlaceOrder
            createLimitOrder={createLimitOrder}
            createMarketOrder={createMarketOrder}
          />
        ) : (
          "You cannot trade DAI"
        )}
      </div>
    </div>
  );
};

export default Wallet;
