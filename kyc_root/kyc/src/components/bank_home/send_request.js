import React, { useState } from "react";
import ViewCustomer from "./ViewCustomer";
import Kycabi from "../../contracts/kyc.json";
import "./bank_home.css";
import Navbar from "../navbar/Navbar";

function SendRequest() {
  const [username, updateUsername] = useState("");
  const web3 = window.web3;
  const acc = web3.currentProvider.selectedAddress;

  const handleOnSubmit = async (event) => {
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
    await kyc.methods.sendRequest(username, acc).send({
      from: acc,
      gas: 4700000,
    });
    let a = await kyc.methods.getEventFlag().call();
    if (a == 1) {
      window.alert(
        "Request already granted. Please access the customer details in view details page"
      );
    } else if (a == 2) {
      window.alert("Request sent successfully");
    } else if (a == -1) {
      window.alert("Request not sent");
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
          Send Request
        </h1>
      </center>
      <br />
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
        <button class="form-field" type="submit" onClick={handleOnSubmit}>
          Request
        </button>
      </div>
      )
    </div>
  );
}

export default SendRequest;
