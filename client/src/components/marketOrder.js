import React from "react";

const MarketOrder = ({ handleMarketOrder }) => {
  // Side side;
  //       uint256 amount;
  //       uint256 filled;
  //       uint256 price;
  //       uint256 date;
  //       address trader;
  //       bytes32 ticker;

  return (
    <>
      <h1>Market Order</h1>
      <form onSubmit={handleMarketOrder}>
        <input type="text" name="ticker" value="BAT" />
        <input type="text" name="side" value="SELL" />
        <input type="text" name="amount" />
        <input type="submit" value="submit" />
      </form>
    </>
  );
};

export default MarketOrder;
