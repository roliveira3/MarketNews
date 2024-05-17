import React from 'react';
import Chart from 'react-apexcharts';
import { Candles } from './MainSP';

interface CandleStickProps {
  candleData: Candles | null;
}

/**
 * CandleStick component.
 * returns a candlestick chart via the react-apexcharts library
 */
const CandleStick: React.FC<CandleStickProps> = ({ candleData }) => {
  if (!candleData) {
    return null;
  }

  /* options object which is passed to react-apexcharts and defines the styling and type*/
  const options = {
    series: [
      { 
        data: candleData.t.map((timestamp, index) => ({
          x: new Date(timestamp * 1000).toLocaleDateString('de-DE'),
          y: [candleData.o[index], candleData.h[index], candleData.l[index], candleData.c[index]],
        })),
      },
    ],
    chart: {
      type: 'candlestick',
      height: 350,
      zoom:{
        enabled: false,
      }     
    },
    xaxis: {
      type: 'category',
      tickAmount: 14 ,
     
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  return <Chart options={options as any} series={options.series} type="candlestick" height={400} />;
};

export default CandleStick;
