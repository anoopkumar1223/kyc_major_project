import React, { useState, useRef } from "react";
import Kycabi from "../../../contracts/kyc.json";
import Navbar from "../customer_home/navbar/Navbar";

function ChangePassword() {
  const web3 = window.web3;
  const acc = web3.currentProvider.selectedAddress;

  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    if (pass != confirm) {
      window.alert("Password not matching");
      return;
    }
    const networkId = await web3.eth.net.getId();
    const networkData = Kycabi.networks[networkId];
    const kyc = new web3.eth.Contract(Kycabi.abi, networkData.address);
    let active = await kyc.methods.getActiveCustomer().call({
      from: acc,
      gas: 4700000,
    });
    console.log(active);

    await kyc.methods.changePasswordCus(active, pass).send({
      from: acc,
      gas: 4700000,
    });
    window.alert("Password updated successfully.");
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
          Change Password
        </h1>
      </center>
      <br />
      <div class="form-container register-form">
        <input
          class="form-field"
          id="pass"
          placeholder="Enter new password"
          type="text"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          name="pass"
        />
        <input
          class="form-field"
          id="confirm"
          placeholder="Confirm new password"
          type="text"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          name="confirm"
        />
        <button class="form-field" type="submit" onClick={handleOnSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
