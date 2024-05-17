
import {StockDetails} from "./MainSP";

interface HeaderProps {
  stockDetails: StockDetails | null;
}

/**
 * Header component.
 * returns the header of the detailed stock page.
 */
export function Header({ stockDetails}: HeaderProps) {
   return (
    <div className="HeaderWrapper">
      <div className="HeaderText">
        <h1>{stockDetails?.name || "Stock not found"}</h1>
        <p className="stocksymbol"> {stockDetails?.symbol || ' '} </p>
      </div>
      <h3>USD {stockDetails?.price|| ' '}</h3>
    </div>
  );
}
