import React, { useState } from "react";
import Kycabi from "../../contracts/kyc.json";

export default function ModifyCustomer(props) {
  const web3 = window.web3;
  const acc = web3.currentProvider.selectedAddress;
  const [user, setUser] = useState({
    username: props.CustomerDetails[0],
    firstName: props.CustomerDetails[1],
    lastName: props.CustomerDetails[2],
    dob: props.CustomerDetails[3],
    phone: props.CustomerDetails[4],
    email: props.CustomerDetails[5],
    address: props.CustomerDetails[6],
    aadharNo: props.CustomerDetails[7],
    panNo: props.CustomerDetails[8],
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

  const onClickModify = async (event) => {
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

    await kyc.methods.modifyCustomer(user.username, getInfo()).send({
      from: acc,
      gas: 4700000,
    });

    let a = await kyc.methods.getEventFlag().call();

    console.log(a);
    if (a == 7) window.alert("Access denied!");
    else if (a == 0) {
      window.alert("Customer data modified!");
      setSubmitted(true);
    }
  };

  const [submitted, setSubmitted] = useState(false);

  return (
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
        readonly="readonly"
        onChange={getUserData}
      />
      <input
        value={user.firstName}
        id="first-name"
        class="form-field"
        type="text"
        placeholder="First Name"
        name="firstName"
        onChange={getUserData}
      />
      <input
        value={user.lastName}
        id="last-name"
        class="form-field"
        type="text"
        placeholder="Last Name"
        name="lastName"
        onChange={getUserData}
      />
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
      <button class="form-field" type="submit" onClick={onClickModify}>
        Confirm
      </button>
    </div>
  );
}
