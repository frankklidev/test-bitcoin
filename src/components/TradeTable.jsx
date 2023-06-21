// TradeTable.jsx
import React, { useEffect, useState } from "react";
import DataGrid from "react-data-grid";

const columns = [
  { key: "time", name: "Time of Trade" },
  { key: "volume", name: "Volume" },
  { key: "price", name: "Price" },
  { key: "side", name: "Trade Side" },
];

const TradeTable = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      const date = new Date(trade.T);
      const timeString = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

      const newTrade = {
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
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        columns={columns}
        rows={trades}
        rowKeyGetter={(row) => row.time}
      />
    </div>
  );
};

export default TradeTable;
