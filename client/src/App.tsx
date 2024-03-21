import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as paths from "./constants/routes";

import Main from "./components/main/Main";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={paths.routs.DEFAULT} element={<Main />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
