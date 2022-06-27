import { BrowserRouter, Routes, Route } from "react-router-dom";
import { React, Component } from "react";
import Web3 from "web3";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import SignInOutContainer from "./components/auth/container";
import BankHome from "./components/bank_home/bank_home";
import ViewKyc from "./components/bank_home/view_kyc.js";
import ModifyKyc from "./components/bank_home/modify_kyc";
import AuthNavbar from "./components/auth/auth_navbar";
import BankDetails from "./components/bank_home/bank_details";
import Login from "./components/customer/auth/login";
import SendRequest from "./components/bank_home/send_request";
import CustomerProfile from "./components/customer/customer_home/profile";
import ChangePassword from "./components/customer/customer_home/change_password";
import Request from "./components/customer/customer_home/request/request";

class App extends Component {
  async componentDidMount() {
    await this.loadWeb3();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <AuthNavbar />
                  <SignInOutContainer />
                </div>
              }
            />
            <Route path="/" element={<SignInOutContainer />} />
            <Route path="/bank_home/add_kyc" element={<BankHome />} />
            <Route path="/bank_home/view_kyc" element={<ViewKyc />} />
            <Route path="/bank_home/modify_kyc" element={<ModifyKyc />} />
            <Route path="/bank_home/bank_details" element={<BankDetails />} />
            <Route path="/customer_home/login" element={<Login />} />
            <Route path="/bank_home/send_request" element={<SendRequest />} />
            <Route
              path="/customer_home/profile"
              element={<CustomerProfile />}
            />
            <Route
              path="/customer_home/changePassword"
              element={<ChangePassword />}
            />
            <Route path="/customer_home/requests" element={<Request />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
