import React from "react";

const OrderBook = ({ orders, trades }) => {
  console.log("orderBook:", orders);
  const { buy, sell } = orders;
  const renderList = (className) => {
    return (
      <>
        <table className={`table ${className}`}>
          <thead>
            <tr>
              <th style={{ padding: "0.2em" }}>amount</th>
              <th style={{ padding: "0.2em" }}>price</th>
            </tr>
          </thead>

          <tbody>
            {buy.slice(0, 3).map((order) => (
              <tr key={order._id}>
                <td style={{ padding: "0.2em" }}>{order.amount}</td>
                <td style={{ padding: "0.2em", color: "green" }}>
                  {order.price}
                </td>
              </tr>
            ))}
          </tbody>
          <br />
          <tbody>
            {sell.slice(0, 3).map((order) => (
              <tr key={order._id}>
                <td style={{ padding: "0.2em" }}>{order.amount}</td>
                <td style={{ padding: "0.2em", color: "red" }}>
                  {order.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };
  const renderTradeList = (className) => {
    return (
      <>
        <table className={`table ${className}`}>
          <thead>
            <tr>
              <th style={{ padding: "0.2em" }}>amount</th>
              <th style={{ padding: "0.2em" }}>price</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((trade) => (
              <tr key={trade._id}>
                <td style={{ padding: "0.2em" }}>{trade.amount}</td>
                {trade.side === "0" ? (
                  <td style={{ padding: "0.2em", color: "green" }}>
                    {trade.price}
                  </td>
                ) : (
                  <td style={{ padding: "0.2em", color: "red" }}>
                    {trade.price}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };
  return (
    <>
      <div className="row">
        <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
          {renderList("")}
        </div>
        <hr style={{ marginTop: 0, marginBottom: 0 }} />
        <h5 className="text-left mb3">Trades</h5>
        <div
          className="col-md-12"
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            maxHeight: 155,
            overflowY: "scroll",
          }}
        >
          {renderTradeList("")}
        </div>
      </div>
    </>
  );
};

export default OrderBook;
