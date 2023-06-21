import React, { useEffect, useState } from "react";
import "react-data-grid/lib/styles.css";
import "./components/style/trade.css";

import DataGrid from "react-data-grid";
import BitcoinPriceGrid from "./components/BitcoinPrice";

const columns = [
  { key: "side", name: "Trade side" },
  { key: "price", name: "Trade price" },
  { key: "volume", name: "Trade volume" },
  { key: "time", name: "Trade time" },
];

function App() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      const date = new Date(trade.T);
      const timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

      const newTrade = {
        tradeId: trade.t,
        time: timeString,
        volume: trade.q,
        price: trade.p,
        side: trade.m ? "Sell" : "Buy",
      };

      setTrades((prevTrades) => [newTrade, ...prevTrades]);
    };

    return () => ws.close();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <div style={{ margin: "20px" }}>
          <BitcoinPriceGrid />
        </div>
        <div className="trade-table" style={{ height: 300, width: 900 }}>
          <DataGrid
            columns={columns}
            rows={trades}
            rowKeyGetter={(row) => row.tradeId}
            rowHeight={30}
            headerHeight={40}
            defaultColumnWidth={150}
          />
        </div>
      </div>
    </div>
  );
}
export default App;
