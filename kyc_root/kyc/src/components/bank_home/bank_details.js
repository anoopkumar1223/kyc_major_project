import { React, Component, useState, useEffect } from "react";
import Kycabi from "../../contracts/kyc.json";
import Navbar from "../navbar/Navbar";

export default function BankDetails() {
  const [details, setDetails] = useState([]);
  const [acc, setAcc] = useState();

  useEffect(() => {
    const getDetails = async () => {
      const web3 = window.web3;
      setAcc(web3.currentProvider.selectedAddress);
      const networkId = await web3.eth.net.getId();
      const networkData = Kycabi.networks[networkId];
      const kyc = new web3.eth.Contract(Kycabi.abi, networkData.address);
      let active = await kyc.methods.getBankActiveAddress().call({
        from: acc,
        gas: 4700000,
      });
      setAcc(active);
      let a = await kyc.methods.viewBank().call({
        from: acc,
        gas: 4700000,
      });
      setDetails(a);
    };

    getDetails();
  }, []);

  return (
    <div>
      <Navbar />
      <br />
      <div
        style={{
          marginLeft: "20px",
        }}
      >
        <div>
          <h3>Bank name : {details[0]}</h3>
        </div>
        <div>
          <h3>ETH Address : {acc}</h3>
        </div>
        <div>
          <h3>Total KYC count : {details[1]}</h3>
        </div>
      </div>
    </div>
  );
}
