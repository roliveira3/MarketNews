import { useNavigate, useParams } from "react-router-dom";
import { News } from "./News";
import { Header } from "./Header";
import { StockData } from "./StockData";
import { useEffect, useState } from "react";

import "./MainSP.css";
/**
 * NewsItem interface.
 * defines the structure of a news item which the server provides.
 */
export interface NewsItem {
    datetime: number;
    headline: string;
    summary: string;
    image: string;
    source: string;
    url: string;
}
/**
 * StockOverview interface.
 * defines the structure of the stock overview which the server provides.
 */
interface StockOverview {
    name: string;
    symbol: string;
    price: number;
    last24h: number;
    last7d: number;
    last30d: number;
  }
  
/**
 * Trends interface.
 * defines the structure of the trend-plo which the server provides.
 */
export interface Trends {
    strongBuy: number;
    buy: number;
    hold: number;
    sell: number;
    strongSell: number;
  }
  
/**
 * StockDetails interface.
 * defines the structure of the stock details which the server provides.
 */
export interface StockDetails extends StockOverview {
    marketCap: number;
    lowPriceWeekly: number;
    lowDateWeekly: string;
    highPriceWeekly: number;
    highDateWeekly: string;
    lowPriceYearly: number;
    lowDateYearly: string;
    highPriceYearly: number;
    highDateYearly: string;
    dividendPerShareYearly: number | null;
    priceRelativeToSP500Yearly: number | null;
    revenuePerShareYearly: number | null;
    trends: Trends;
  }

  //candles object the server provides and are passed to the react-apexcharts library
export interface Candles {
    o: number[];
    l: number[];
    h: number[];
    c: number[];
    t: number[];
  }

/**
 * The detailed stock page.
 * component which is rendered when a user clicks on a stock in the overview page.
 */
export function MainSP() {
    //you can access the stock name from the url using the following line, id is the name of the stock;
    let { id } = useParams();
    const navigate = useNavigate();
 
    const [news, setNews] = useState<NewsItem[] | null>(null);
    const [stockDetails, setStockDetails] = useState<StockDetails | null>(null);
    const [candles, setCandles] = useState<Candles | null>(null);

    /*fetch data here and then pass it down*/ 
  useEffect(() => {
    if (id) {
      // fetch news data of a specific company
      fetch("/company-news?symbol=" + id)
      .then((response) => {
        if (!response.ok) {
          /* Handle non-successful response (e.g., 404), for the first fetch only, 
          as it is thrown when the id does not exist*/
          navigate('/404');
        }
        return response.json();
        })
        .then((data) => {
          setNews(data.message);
        })
        .catch((error) =>{ 
          console.log(error); 
          navigate('/404');
          });

      fetch("/stock-details?symbol=" + id) 
      // fetch stockdetails of specific company
          .then((response) => response.json())
          .then((data) => {
              setStockDetails(data.message);
          })
          .catch((error) => {
            console.log(error);
            navigate('/404');
          });
          
      fetch("/candles?symbol=" + id)  
          .then((response) => response.json())
          .then((data) => {
              setCandles(data.message);
          })
          .catch((error) => {
            console.log(error);
            navigate('/404');});
        
    }else{
        /*id in the browser is not set*/
    }
  }, [id, navigate]);

  /*if the server is still fetching the data, show a loading message*/
    return (
    <main className="container-fluid mainSP">  
    {stockDetails && candles? <div className="StockWrapper">
        <Header stockDetails={stockDetails} ></Header>
        <StockData stockDetails={stockDetails} candles ={candles} ></StockData>   
      </div> :<p>Loading stockdetails...</p>}   
        
        {news ? (
        <News news={news}></News>
      ) : (
        <p>Loading news...</p>
      )}
    </main>
    );
}
