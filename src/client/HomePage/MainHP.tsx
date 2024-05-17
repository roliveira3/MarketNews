import "./MainHP.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import infobutton from "./infobtn.png";
import { DisplayGraph } from "./DisplayGraph";

interface StockOverview {
  name: string;
  symbol: string;
  price: number;
  last24h: number;
  last7d: number;
  last30d: number;
}
let TableHeaders : string[] = ["Name","Symbol","Price","Last 24h","Last 7d","Last 30d"];

export function MainHP() {
  const [currData,setData] = useState<StockOverview[]>();
  const [sort,setSort] = useState({key: 0, dir: "desc", filter: ""});
  useEffect(() => {
      console.log("fetching data");
      fetch('/stocks-overview?category=topStocks',{method: "GET"}    )
      .then((response) => response.json()) //parse response as JSON
      .then((res) => setData(res.message as StockOverview[])) // set the state
      .catch((error) => console.log(error)); 
  },[]);  

  return (
    <>
      <nav className="container-fluid">
        <ul>
          <li>
            <h1>Market News <span data-placement="bottom" data-tooltip="This Website is aimed at providing you with information about the current standing of stocks on the Nasdaq. You can search and click on stocks to get redirected to a more detailed view with news and more specific stats. Please be aware that we are limited to 20 stocks by our API." className="infobutton"><img src={infobutton} alt="" className="infoimg"/></span></h1> 
          </li>
        </ul>
        <ul>
          <li>
            <input type="search" placeholder="Search..." spellCheck="false" onChange={(e) => (setSort({key: sort.key, dir: sort.dir, filter: e.target.value}))}/>
          </li>
        </ul>
      </nav>
      <main className="mainHP">
        <DisplayTable tableData = {currData} sort = {sort} setSort={setSort}/>
      </main>
    </>
  );
}
/**
 * 
 * @param tableData: data to be displayed in the table
 * @param sort: sorting information: { key: index of column to sort by, dir: direction of sorting, filter: filter string }
 * @param setSort: function to set sorting information
 * 
 * @returns Table with data from tableData sorted by sort and filtered by sort.filter
 */
function DisplayTable({tableData, sort, setSort} : {tableData: any,sort: any, setSort: any}){  
  let navigate = useNavigate();
  /** 
   * @param i: index of column to sort by
   * 
   * handles click on header of column i and sets sorting information accordingly
   * 
  */
  function handleHeaderClick(i:number){
    let newSort = {key: i, 
                  dir: i==sort.key ? sort.dir == "asc" ? "desc" : "asc" : "desc",
                  filter: sort.filter};
    setSort(newSort);
  }

  /** 
   * 
   * @param tableToSort: data to be sorted
   * 
   * sorts and filters tableToSort according to sort
   * 
   */
  function sortTable(tableToSort:any){
    let sorted = tableToSort.sort((a:any,b:any) => {
      if(sort.dir == "asc"){
        return Object.values(a as Object)[sort.key] > Object.values(b as Object)[sort.key] ? -1 : 1;
      }else{
        return Object.values(a as Object)[sort.key] < Object.values(b as Object)[sort.key] ? -1 : 1;
      }
    });
    let sortedArray = [...sorted];
    if(sort.filter != ""){
      sortedArray = sortedArray.filter((row:any) => {
        return Object.values(row as Object).some((value:any) => {
          return value.toString().toLowerCase().includes(sort.filter.toLowerCase());
        })
      });
    }
    return sortedArray;
  }

  return (<>
  <table>
    <thead>
      <tr>
        {TableHeaders.map((head,i) => {
          return (
          <th key={i.toString()} >
            <div onClick={() => handleHeaderClick(i)} className={sort.key == i ? sort.dir == "asc" ? "asc" : "desc" : ""}>
              {head + " "} 
              {sort.key == i ? sort.dir == "asc" ? <i className="fa-solid fa-caret-up"></i> 
              : <i className="fa-solid fa-caret-down"></i> 
              : <i className="fa-solid fa-sort"></i>}
            </div>
          </th>
          )})}
        <th style={{color: "black"}}>Last 30 days</th>
      </tr>
    </thead>
    <tbody>
      {tableData ? sortTable(tableData).map((row:StockOverview,i:number) => {
        let path: string = "/view/" + row.symbol;
        return <tr key={i.toString()} onClick={() => navigate(path)}>
          {Object.values(row).map((value, j) => {
            if(j==3 || j==4 || j==5){
              let sign: boolean = value as number < 0;
              let zero: boolean = value as number == 0;
              return <td key={j.toString()} 
                            className={"number " + (zero ? "neutral" : sign ? "negative" : "positive")}>
                            &nbsp;
                            {zero ? <i className="fa-solid fa-equals"></i>
                            : sign ? <i className="fa-solid fa-angle-down"></i>
                            : <i className="fa-solid fa-angle-up"></i>}&nbsp;
                            {Math.abs(value as number) + "%"}</td>
            }else if(j==2){
              return <td key={j.toString()} className="currency">${value as any}</td>
            }else{
            return <td key={j.toString()}>{value as any}</td>
            }
          })}
          <td>
            <DisplayGraph symbol={row.symbol}/>
          </td>
        </tr>
      }) : <tr><td><i aria-busy="true"></i> Loading content.......</td><td></td><td></td><td></td><td></td><td></td><td><div style={{height: 165, width: 300, display: "flex", alignItems:"center", justifyContent: "center"}}><i aria-busy="true"></i></div></td></tr>}
    </tbody>
  </table>
  </>);
}