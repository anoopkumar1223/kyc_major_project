import { React, Component, useState, useEffect } from "react";
import Kycabi from "../../../contracts/kyc.json";
import Navbar from "../customer_home/navbar/Navbar";
import ViewCustomer from "../../bank_home/ViewCustomer";

export default function CustomerProfile() {
  const [customerDetails, updatecustomerDetails] = useState([]);
  const [acc, setAcc] = useState();

  useEffect(() => {
    const getDetails = async () => {
      const web3 = window.web3;
      setAcc(web3.currentProvider.selectedAddress);
      const networkId = await web3.eth.net.getId();
      const networkData = Kycabi.networks[networkId];
      const kyc = new web3.eth.Contract(Kycabi.abi, networkData.address);
      let active = await kyc.methods.getActiveCustomer().call({
        from: acc,
        gas: 4700000,
      });
      setAcc(active);
      let a = await kyc.methods
        .viewCustomer(active)
        .call({ from: acc, gas: 4700000 });
      let verifiedBy = await kyc.methods
        .getVerifiedBy(active)
        .call({ from: acc, gas: 4700000 });
      let cusEth = await kyc.methods
        .getCustomerETHAdd(active)
        .call({ from: acc, gas: 4700000 });
      updatecustomerDetails(a.split("!@#"));
      updatecustomerDetails((oldArray) => [...oldArray, cusEth]);
      updatecustomerDetails((oldArray) => [...oldArray, verifiedBy]);
      console.log(customerDetails);
    };

    getDetails();
  }, []);

  return (
    <div>
      <Navbar />
      <br />
      <ViewCustomer CustomerDetails={customerDetails} />
    </div>
  );
}
