import React, { Component, useState } from "react";
import Kycabi from "../../contracts/kyc.json";
import ModifyCustomer from "./ModifyCustomer";
import Navbar from "../navbar/Navbar";

export default function ModifyKyc() {
  const [permission, updatePermission] = useState(false);
  const [customerDetails, updatecustomerDetails] = useState([]);
  const web3 = window.web3;
  const acc = web3.currentProvider.selectedAddress;
  const [username, updateUsername] = useState("");

  const OnClickSearch = async (event) => {
    event.preventDefault();
    const networkId = await web3.eth.net.getId();
    const networkData = Kycabi.networks[networkId];
    const kyc = new web3.eth.Contract(Kycabi.abi, networkData.address);

    let active = await kyc.methods.getBankActiveAddress().call({
      from: acc,
      gas: 4700000,
    });

    if (active.toUpperCase() != acc.toUpperCase()) {
      window.alert(`Your account is ${active} but selected account is ${acc}`);
      return;
    }

    let allowed = await kyc.methods
      .isAllowed(username, acc)
      .call({ from: acc, gas: 4700000 });

    if (allowed == 1) {
      window.alert("Request has not yet been processed by customer.");
      return;
    } else if (allowed == 3) {
      window.alert("Request has been rejected by the customer.");
      return;
    } else if (allowed == 2) {
      let a = await kyc.methods
        .viewCustomer(username)
        .call({ from: acc, gas: 4700000 });

      if (a == "") {
        window.alert("Customer data not found");
        return;
      } else if (a == "Access denied!") {
        window.alert("Access denied!");
        return;
      } else {
        updatecustomerDetails(a.split("!@#"));
        updatePermission(true);
      }
    } else if (allowed == 4) {
      window.alert(
        "Access denied! Please request the customer to access the details."
      );
    }
  };

  return (
    <div>
      <Navbar />
      <br />
      <center>
        <h1
          style={{
            marginLeft: "20px",
          }}
        >
          Modify Kyc
        </h1>
      </center>
      <br />
      {!permission ? (
        <div class="form-container register-form">
          <input
            class="form-field"
            id="username"
            placeholder="Enter username to search"
            type="text"
            value={username}
            onChange={(e) => updateUsername(e.target.value)}
            name="username"
          />
          <button class="form-field" type="submit" onClick={OnClickSearch}>
            Search
          </button>
        </div>
      ) : (
        <ModifyCustomer CustomerDetails={customerDetails} />
      )}
    </div>
  );
}
