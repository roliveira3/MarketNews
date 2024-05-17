import { useEffect, useState } from "react";
import Chart from 'react-apexcharts';
import { Candles } from "../StockPage/MainSP";
/**
 * 
 * @param symbol: symbol of stock to display 
 * 
 * @returns Line chart of stock price over the last 30 days of the stock with the given symbol.
 * If no data is available, display a loading icon.
 */
export function DisplayGraph({ symbol }: { symbol: string; }) {
  let [candles, setCandles] = useState<Candles>();
  useEffect(() => {
    fetch("/candles?symbol=" + symbol)
      .then((response) => response.json())
      .then((data) => {
        setCandles(data.message);
      })
      .catch((error) => console.log(error));
  }, [symbol]);

  if (!candles) {
    return <div style={{height: 165, width: 300, display: "flex", alignItems:"center", justifyContent: "center"}}><i aria-busy="true"></i></div>;
  }
  let len = candles.t[candles.t.length - 30] as number;
  const state = {
    series: [
      {
        name: symbol,
        data: candles.t.map((timestamp, index) => ({
          x: new Date(timestamp * 1000).getTime(),
          y: candles?.c[index]
        })),
      },
    ],
    options: {
      chart: {
        id: "chart",
        type: "line",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          show: false,
        },
        min: new Date(len * 1000).getTime(),
        tickAmount: 6,
        tooltip: {
          enabled: false,
        },
      },
      tooltip: {
        enable: false,
        x: {
          format: 'dd MMM yyyy'
        }
      },
      yaxis: {
        tooltip: {
          enable: false,
        },
        labels: {
          formatter: (val: any) => {
            return "$" + val;
          }
        }
      },
    }
  };

  return <> {candles ? <Chart options={state.options as any} series={state.series} type="line" height={150} width={300} /> : "loading"}</>;
}
