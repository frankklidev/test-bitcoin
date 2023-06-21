import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const BitcoinPriceGrid = () => {
  const [rowData, setRowData] = useState([]);
  const columns = [
    { field: "bid", headerName: "Bid", width: 150 },
    { field: "ask", headerName: "Ask", width: 150 },
  ];

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          "https://api.binance.com/api/v3/ticker/bookTicker",
          {
            params: {
              symbol: "BTCUSDT",
            },
          }
        );

        const bid = {
          id: 1,
          bid: response.data.bidPrice,
          ask: response.data.askPrice,
        };

        setRowData([bid]);
      } catch (error) {
        console.error("Error fetching Bitcoin prices:", error);
      }
    };

    fetchPrices();
    const intervalId = setInterval(fetchPrices, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div
        style={{ textAlign: "center", fontWeight: "bold", marginTop: "20px" }}
      >
        Bitcoin Infos (BTC/USDT)
      </div>
      <div style={{ height: 150, width: 400, margin: "auto" }}>
        <DataGrid
          rows={rowData}
          columns={columns}
          autoHeight
          hideFooterPagination
        />
      </div>
      <div
        style={{ textAlign: "center", fontWeight: "bold", marginTop: "20px" }}
      >
        Bitcoin lives trades (BTC/USDT)
      </div>
    </div>
  );
};

export default BitcoinPriceGrid;
