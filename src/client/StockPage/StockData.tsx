import { useState, useEffect } from 'react';
import DoughnutComponent from "./Doughnut";
import CandleStick from "./CandleStick";
import { StockDetails, Trends, Candles } from "./MainSP";



interface HeaderProps {
  // Modify to use state and allow for null values
  stockDetails: StockDetails | null;
  candles: Candles | null;
}

export function StockData({ stockDetails: initialStockDetails, candles: initialCandles }: HeaderProps) {
  // Use state for stockDetails and candles
  const [stockDetails, setStockDetails] = useState<StockDetails | null>(initialStockDetails);
  const [candles, setCandles] = useState<Candles | null>(initialCandles);
  const trends: Trends | undefined = stockDetails?.trends;

  // useEffect to update state when initial props change
  useEffect(() => {
    setStockDetails(initialStockDetails);
    setCandles(initialCandles);
  }, [initialStockDetails, initialCandles]);

  return (
    <div className="StockDataWrapper">
        {stockDetails ? 
          <div className='candleStick'><CandleStick candleData={candles}></CandleStick></div> : 
            // catch empty data with a warning
            <div>No data for candle stick available.</div>}
      
      {/*this below is a bit of hardcoding, we could have also used an array, but since it was really individual if he had to format it as a time or number, we just hardcoded it*/}
      {(stockDetails && (
        <div className="databox">
          <h2>Key Data</h2>
          <div className="gridWrapper">
            <div className="data-grid">
              <div className="data-item" data-tooltip="Lowest Price reached in the last week">
                <p className='firstChild' >Low Price Week</p>
                <p className='secondChild'>${format(stockDetails['lowPriceWeekly'])}</p>
              </div>
              <div className="data-item hide" data-tooltip="Date where weekly low was met">
                <p className='firstChild'>Low Date Week</p>
                <p className='secondChild'>{formatDate(stockDetails['lowDateWeekly'])}</p>
              </div>
              <div className="data-item" data-tooltip="Highest Price reached in the last week">
                <p className='firstChild'>High Price Week</p>
                <p className='secondChild'>${format(stockDetails['highPriceWeekly'])}</p>
              </div>
              <div className="data-item hide" data-tooltip="Date where weekly high was met">
                <p className='firstChild'>High Date Week</p>
                <p className='secondChild'>{formatDate(stockDetails['highDateWeekly'])}</p>
              </div>
              <div className="data-item" data-tooltip="Lowest Price reached in the lat 52 weeks">
                <p className='firstChild'>Low Price Year</p>
                <p className='secondChild'>${format(stockDetails['lowPriceYearly'])}</p>
              </div>
              <div className="data-item hide" data-tooltip="Date where yearly low  was met">
                <p className='firstChild' >Low Date Year</p>
                <p className='secondChild'>{formatDate(stockDetails['lowDateYearly'])}</p>
              </div>
              <div className="data-item" data-tooltip="Highest Price reached in the last 52 weeks">
                <p className='firstChild' >High Price Year</p>
                <p className='secondChild'>${format(stockDetails['highPriceYearly'])}</p>
              </div>
              <div className="data-item hide" data-tooltip="Date where yearly high Price was met">
                <p className='firstChild' >High Date Year</p>
                <p className='secondChild'>{formatDate(stockDetails['highDateYearly'])}</p>
              </div>
              
              {(stockDetails['dividendPerShareYearly']?<div className="data-item" data-tooltip="Yearly Dividend per Share">
                <p className='firstChild' >Dividend Per Share</p>
                <p className='secondChild'>${format(stockDetails['dividendPerShareYearly'])}</p>
              </div> : '')}
              <div className="data-item hide" data-tooltip="Yearly Revenue per Share">
                <p className='firstChild' >Revenue Per Share</p>
                <p className='secondChild'>{stockDetails['revenuePerShareYearly']?"$"+format(stockDetails['revenuePerShareYearly']):'not Found'}</p>
              </div>
              <div className="data-item hide" data-tooltip="Market Cap of the stock">
                <p className='firstChild' >Market Cap</p>
                <p className='secondChild'>${formatCap(stockDetails['marketCap'])}B</p>
              </div>
              <div className="data-item" data-tooltip="Stock Performance Relative to the SMP500">
                <p className='firstChild'>Relative SP500</p>
                <p className='secondChild'>{stockDetails['priceRelativeToSP500Yearly']?format(stockDetails['priceRelativeToSP500Yearly']):'notfound'}%</p>
              </div>
            </div>
          </div>
          <div className="trendPlot" data-tooltip="Latest analyst recommendation">
            <div className="doughnutPlot"> 
              <DoughnutComponent trendsData={trends}/>
            </div>
          </div>
        </div>
      )||<p> Loading ...</p>)}
    </div>
  );
}

/*make a number only have 2 decimal places and add ' every 3 digits before and return a string*/
function format(num: number) {
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&'");
}
/*market cap number is in Billion(Milliarden) and should therefore be formated differently*/ 
function formatCap(num: number) {
  num /= 1e3;
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&'");
}


/*formats dates in the components */
function formatDate(inputDate: string | undefined): string {
  if (!inputDate) {
    return "Invalid Date";
  }
  // Parse the input date string
  const dateObject = new Date(inputDate);

  // Check if the date is valid
  if (isNaN(dateObject.getTime())) {
    return "Invalid Date";
  }
  // Get day, month, and year components
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = dateObject.getFullYear();
  // Format the date as "dd.mm.yyyy"
  const formattedDate = `${day}.${month}.${year}`;

  return formattedDate;
}