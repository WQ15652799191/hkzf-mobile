import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import Home from "./pages/Home";
import CityList from "./pages/CityList";
import Map from "./pages/Map";
function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/home" component={Home}></Route>
        <Route path="/citylist" component={CityList}></Route>
        <Route path="/" exact render={() => <Redirect to="/home"></Redirect>} />
        <Route path="/map" component={Map}></Route>
      </div>
    </Router>
  );
}

export default App;
