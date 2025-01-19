import React from "react";

const StockList = () => {
  const stocks = [
    { symbol: "TSLA", name: "Tesla, Inc.", price: "$238.45", change: "+2.5%" },
    {
      symbol: "INTC",
      name: "Intel Corporation",
      price: "$44.32",
      change: "-1.2%",
    },
    { symbol: "AAPL", name: "Apple Inc.", price: "$189.71", change: "+1.8%" },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: "$378.85",
      change: "+0.5%",
    },
  ];

  return (
    <div>
      {stocks.map((stock) => (
        <div key={stock.symbol} className="stock-item">
          <div className="stock-name">{stock.name}</div>
          <div className="stock-symbol">{stock.symbol}</div>
          <div className="stock-price">{stock.price}</div>
          <div
            className={`stock-change ${
              stock.change.startsWith("-") ? "negative" : "positive"
            }`}
          >
            {stock.change}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StockList;
