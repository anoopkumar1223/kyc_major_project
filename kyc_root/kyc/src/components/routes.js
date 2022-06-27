import React, { Component } from "react";
import { Router, Routes, Route } from "react-router-dom";
import { createBrowserHistory as history } from "history";

import BankHome from "./bank_home/bank_home";
import SignInOutContainer from "./auth/container";

export default class MyRoutes extends Component {
  render() {
    return (
      <Router history={history}>
        <Routes>
          <Route path="/" exact component={SignInOutContainer} />
          <Route path="/bankhome" component={BankHome} />
        </Routes>
      </Router>
    );
  }
}
