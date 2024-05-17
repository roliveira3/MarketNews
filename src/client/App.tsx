import "./App.css";
import { MainHP } from './HomePage/MainHP';
import { MainSP } from './StockPage/MainSP';
import { ErrorPage } from "./ErrorPage";
import {BrowserRouter,Routes,Route} from "react-router-dom";
/** 
 *  displays the main page, stock page or error page depending on the url using react router.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainHP/>}/>
        <Route path="/view/:id" element={<MainSP/>}/>
        <Route path="/404" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App; 
