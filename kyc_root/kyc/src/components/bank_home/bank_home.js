import React, { useState } from "react";
import "./bank_home.css";
import Kycabi from "../../contracts/kyc.json";
import Navbar from "../navbar/Navbar";

export default function BankHome(props) {
  const web3 = window.web3;
  const acc = web3.currentProvider.selectedAddress;

  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    aadharNo: "",
    panNo: "",
    password: "",
    addr: "",
  });

  function getInfo() {
    var data =
      user.username +
      "!@#" +
      user.firstName +
      "!@#" +
      user.lastName +
      "!@#" +
      user.dob +
      "!@#" +
      user.phone +
      "!@#" +
      user.email +
      "!@#" +
      user.address +
      "!@#" +
      user.aadharNo +
      "!@#" +
      user.panNo +
      "!@#";
    return data;
  }

  let name, value;
  const getUserData = (event) => {
    name = event.target.name;
    value = event.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const onClick = async (event) => {
    const networkId = await web3.eth.net.getId();
    const networkData = Kycabi.networks[networkId];
    const kyc = new web3.eth.Contract(Kycabi.abi, networkData.address);

    event.preventDefault();

    let active = await kyc.methods.getBankActiveAddress().call({
      from: acc,
      gas: 4700000,
    });

    if (active.toUpperCase() != acc.toUpperCase()) {
      window.alert(`Your account is ${active} but selected account is ${acc}`);
      return;
    }

    let verifiedBy = await kyc.methods
      .getActiveBankName()
      .call({ from: acc, gas: 4700000 });

    await kyc.methods
      .addCustomer(
        user.username,
        getInfo(),
        user.password,
        user.addr,
        verifiedBy
      )
      .send({
        from: acc,
        gas: 4700000,
      });

    let a = await kyc.methods.getEventFlag().call();

    console.log(a);
    if (a == 7) window.alert("Access denied!");
    else if (a == 2) window.alert("Customer already exists");
    else if (a == 0) {
      window.alert("Customer added!");
      setSubmitted(true);
    }
  };

  const [submitted, setSubmitted] = useState(false);

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
          Add Kyc Details
        </h1>
      </center>
      <div class="form-container register-form">
        {submitted ? (
          <div class="success-message">Success! Thank you for registering</div>
        ) : null}
        <input
          value={user.username}
          id="user-name"
          class="form-field"
          type="text"
          placeholder="Username"
          name="username"
          onChange={getUserData}
        />
        {/* <span id="user-name-error">Please enter a first name</span> */}
        <input
          value={user.firstName}
          id="first-name"
          class="form-field"
          type="text"
          placeholder="First Name"
          name="firstName"
          onChange={getUserData}
        />
        {/* <span id="first-name-error">Please enter a last name</span> */}
        <input
          value={user.lastName}
          id="last-name"
          class="form-field"
          type="text"
          placeholder="Last Name"
          name="lastName"
          onChange={getUserData}
        />
        {/* <span id="last-error">Please enter an email address</span> */}

        <input
          value={user.dob}
          id="dob"
          class="form-field"
          type="text"
          placeholder="DOB"
          name="dob"
          onChange={getUserData}
        />
        <input
          value={user.phone}
          id="phone"
          class="form-field"
          type="number"
          placeholder="Phone"
          name="phone"
          onChange={getUserData}
        />
        <input
          value={user.email}
          id="email"
          class="form-field"
          type="email"
          placeholder="Email"
          name="email"
          onChange={getUserData}
        />
        <input
          value={user.address}
          id="address"
          class="form-field"
          type="text"
          placeholder="address"
          name="address"
          onChange={getUserData}
        />
        <input
          value={user.aadharNo}
          id="aadharNo"
          class="form-field"
          type="number"
          placeholder="Aadhar Number"
          name="aadharNo"
          onChange={getUserData}
        />
        <input
          value={user.panNo}
          id="panNo"
          class="form-field"
          type="text"
          placeholder="PAN number"
          name="panNo"
          onChange={getUserData}
        />
        <input
          value={user.password}
          id="password"
          class="form-field"
          type="text"
          placeholder="Password"
          name="password"
          onChange={getUserData}
        />
        <input
          value={user.addr}
          id="addr"
          class="form-field"
          type="text"
          placeholder="Customer's public ETH address"
          name="addr"
          onChange={getUserData}
        />
        <button class="form-field" type="submit" onClick={onClick}>
          Register
        </button>
      </div>
    </div>
  );
}
