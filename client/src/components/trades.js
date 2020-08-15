import React, { useReducer } from "react";
import Moment from "react-moment";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import OrderBook from "./orderBook";

const Trades = ({ orders, user, web3, trades }) => {
  console.log("trades line70:", orders.allOrders);
  console.log("trades line72:", trades);
  const renderChart = (trades) => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={trades}>
          <Line type="monotone" dataKey="price" stroke="#741cd7" />
          <CartesianGrid stroke="#000000" />
          <XAxis
            dataKey="date"
            tickFormatter={(dateStr) => {
              const date = new Date(parseInt(dateStr) * 1000);
              return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            }}
          />
          <YAxis dataKey="price" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderMyOrdersList = () => (
    <>
      <table className={`table`}>
        <thead>
          <tr>
            <th>Token</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Side</th>
            <th>Filled</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.buy.map((order, index) => {
            if (orders.buy[index].trader == user.accounts[0]) {
              return (
                <tr key={order._id}>
                  <td>{web3.utils.hexToUtf8(order.ticker)}</td>
                  <td>{order.amount}</td>
                  <td>{order.price}</td>
                  <td>{order.side}</td>
                  <td>{order.filled}</td>
                  <td>
                    <Moment format="YYYY/MM/DD">{order.date}</Moment>
                  </td>
                </tr>
              );
            }
          })}
          {orders.sell.map((order, index) => {
            if (orders.sell[index].trader == user.accounts[0]) {
              return (
                <tr key={order._id}>
                  <td>{web3.utils.hexToUtf8(order.ticker)}</td>
                  <td>{order.amount}</td>
                  <td>{order.price}</td>
                  <td>{order.side}</td>
                  <td>{order.filled}</td>
                  <td>
                    <Moment format="YYYY/MM/DD">{order.date}</Moment>
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </>
  );
  return (
    <>
      <div className="col-md-12" style={{ paddingLeft: 0 }}>
        <div className="row">
          <div className=" col-md-9">
            <div className="card" style={{ marginRight: 0, padding: 10 }}>
              <h5 className="text-left">All trades</h5>
              <hr style={{ marginTop: 0 }} />
              {renderChart(trades)}
            </div>
          </div>

          <div className="card col-md-3" style={{ paddingTop: 10 }}>
            <h5 className="text-left mb3">Order Book</h5>
            <OrderBook orders={orders} trades={trades} />
          </div>
        </div>
      </div>

      <div className="col-md-12 card" style={{ marginTop: 15, padding: 10 }}>
        <h5 className="text-left mb3">My Orders</h5>
        {renderMyOrdersList()}
      </div>
    </>
  );
};

export default Trades;
