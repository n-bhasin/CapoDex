import React from "react";
import "../App.css";

const TYPE = { LIMIT: "LIMIT", MARKET: "MARKET" };
const SIDE = { BUY: "BUY", SELL: "SELL" };
const PlaceOrder = ({ createLimitOrder, createMarketOrder }) => {
  const [order, setOrder] = React.useState({
    type: TYPE.LIMIT,
    side: SIDE.BUY,
    amount: "",
    price: "",
  });
  const onSubmit = (e) => {
    e.preventDefault();
    if (order.type === TYPE.MARKET) {
      createMarketOrder(order.amount, order.side);
    } else {
      createLimitOrder(order.amount, order.price, order.side);
    }
  };
  return (
    <div id="orders" className="">
      <h5 className="text-left" style={{ marginBottom: "1em" }}>
        Place Order
      </h5>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-group row">
          {/* <label htmlFor="type" className="col-sm-4 col-form-label">
            Type
          </label> */}
          <div className="col-md-12">
            <div id="type" className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-secondary ${
                  order.type === TYPE.LIMIT ? "active" : ""
                }`}
                onClick={() =>
                  setOrder((order) => ({ ...order, type: TYPE.LIMIT }))
                }
              >
                LIMIT
              </button>
              <button
                type="button"
                className={`btn btn-secondary ${
                  order.type === TYPE.MARKET ? "active" : ""
                }`}
                onClick={() =>
                  setOrder((order) => ({ ...order, type: TYPE.MARKET }))
                }
              >
                MARKET
              </button>
            </div>
          </div>
        </div>
        <div className="form-group row">
          {/* <label htmlFor="side" className="col-sm-4 col-form-label">
            Side
          </label> */}
          <div className="col-md-12">
            <div id="side" className="btn-group" role="group">
              <button
                type="button"
                // style={{ backgroundColor: "green", border: "none" }}
                className={`btn btn-success buyButton${
                  order.side === SIDE.BUY ? "active" : ""
                }`}
                onClick={() =>
                  setOrder((order) => ({ ...order, side: SIDE.BUY }))
                }
              >
                BUY
              </button>
              <button
                type="button"
                // style={{ backgroundColor: "red", border: "none" }}
                className={`btn btn-danger sellButton${
                  order.side === SIDE.SELL ? "active" : ""
                }`}
                onClick={() =>
                  setOrder((order) => ({ ...order, side: SIDE.SELL }))
                }
              >
                SELL
              </button>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <div className="col-md-12">
            <div className="input-group ">
              <input
                type="text"
                className="form-control"
                id="order-amount"
                placeholder="enter the amount"
                onChange={({ target: { value } }) =>
                  setOrder((order) => ({ ...order, amount: value }))
                }
              />
            </div>
          </div>
        </div>
        {order.type === TYPE.MARKET ? null : (
          <div className="form-group row">
            {/* <label className="col-sm-4 col-form-label" htmlFor="order-amount">
              Price
            </label> */}
            <div className="col-md-12">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="order-price"
                  placeholder="enter the price"
                  onChange={({ target: { value } }) =>
                    setOrder((order) => ({ ...order, price: value }))
                  }
                />
              </div>
            </div>
          </div>
        )}
        <div className="form-group">
          <button type="submit" className="btn btn-primary form-control">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
