import { Doughnut } from 'react-chartjs-2';
import { Trends } from "./MainSP";

import { 
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

interface HeaderProps {
  trendsData: Trends | undefined;
}

/**
 * Pie chart component for the Expert-Trends.
 * returns a pie chart via the react-chartjs-2 library.
 */
export function DoughnutComponent({ trendsData }: HeaderProps) {
  const colors = {
    strongBuy: 'green',
    buy: 'lightgreen',
    hold: 'grey',
    sell: 'lightcoral',
    strongSell: 'red',
  };

  const data = [ 
    { label: 'Strong Buy', count: trendsData?.strongBuy, color: colors.strongBuy },
    { label: 'Buy', count: trendsData?.buy, color: colors.buy },
    { label: 'Hold', count: trendsData?.hold, color: colors.hold },
    { label: 'Sell', count: trendsData?.sell, color: colors.sell },
    { label: 'Strong Sell', count: trendsData?.strongSell, color: colors.strongSell },
  ];

  // sort the data to have the same order as the colors
  data.sort((a, b) => {
    const order = ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'];
    return order.indexOf(a.label) - order.indexOf(b.label);
  });

  //options object which is passed to react-chartjs-2 and defines the styling and type
  const options = {
    cutout: "60%", // innerRadius
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  //data passed to the piechart
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [{
      data: data.map(item => item.count),
      backgroundColor: data.map(item => item.color),
      borderColor: 'white',
      borderWidth: 2,
    }],
  };
  
  return <Doughnut id="doughnutChart" data={chartData} options={options} />;
}

export default DoughnutComponent;
