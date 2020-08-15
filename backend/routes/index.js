const Web3 = require("web3");
const mongoose = require("mongoose");
const Order = require("../models/orders");
const { ethers } = require("ethers");
var express = require("express");
const orders = require("../models/orders");
var router = express.Router();

let orderIds = [];
const web3 = new Web3();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/orders/:ticker", async function (req, res, next) {
  const ticker = req.params.ticker;
  const orders = await Order.find({ ticker: ticker }).sort("-price");
  const buy = [];
  const sell = [];
  const all = [];
  if (orders == []) {
    res.json({ message: "There are no orders." });
  }

  for (let i = 0; i < orders.length; i++) {
    if (orders[i].side == "BUY") {
      buy.push(orders[i]);
      all.push(orders[i]);
    } else {
      sell.push(orders[i]);
      all.push(orders[i]);
    }
  }
  console.log(orders);
  res.json({
    buyOrder: buy,
    sellOrder: sell,
    all: all,
    message: "success",
  });
});

router.get("/ordersBySide/:ticker/:side", async function (req, res, next) {
  const ticker = req.params.ticker;
  const side = req.params.side;
  console.log(ticker, side);
  const orders = await Order.find({ ticker: ticker, side: side }).sort(
    "-price"
  );

  if (orders == []) {
    res.json({ message: "There are no orders." });
  }

  res.json({ orders: orders, message: "success" });
});

router.post("/orders", async function (req, res, next) {
  const newOrder = new Order(req.body.order);

  const result = await newOrder.save();
  res.json({ message: "successfully Created" });
});

router.get("/marketOrders", async function (req, res, next) {
  res.json({ message: "Market Orders." });
});

// router.post("/marketOrders", async function (req, res, next) {
//   //console.log(req.body);
//   let { ticker, amount, side } = req.body;

//   // if (side == "BUY") {
//   //   side = "SELL";
//   // } else {
//   //   side = "BUY";
//   // }
//   // const orders = await Order.find({ ticker: ticker, side: side }).sort(
//   //   "-price"
//   // );
//   // console.log(orders);

//   // let result = await deleteConfirmedOrders(orders);
//   //console.log(i);
//   res.json({ message: "done" });
// });

router.put("/updateConfirmedOrders", async function (req, res, next) {
  console.time("Update");
  const order = req.body;
  console.log(order);

  const orderById = await Order.findById(req.body.updateOrder._id);
  console.log("orderById: line91:", orderById);
  // orderById.filled = order.filled;
  // orderById.signature.v = order.signature.v;
  // orderById.signature.r = order.signature.r;
  // orderById.signature.s = order.signature.s;
  orderById.filled = req.body.updateOrder.filled;
  const updateOrder = new Order(orderById);
  await updateOrder.save();
  console.timeEnd("Update");

  res.json({ message: "Updated Successfully", order: updateOrder });
});
router.delete("/deleteConfirmedOrders/:id", async function (req, res, next) {
  // console.log("orderIds", orderIds);
  const orders = req.params.id;
  console.log("order delete line:106", JSON.stringify(orders));
  Order.findByIdAndDelete(orders).then((res) => {
    console.log("deleted");
  });
  res.json({ message: "Order Confirmed Successfully." });
  // for (i = 0; i < orders.length; i++) {
  //   console.log("orders[i]", orders[i]);

  //   return i;
  // }
});

module.exports = router;
