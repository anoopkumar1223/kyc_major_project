import AcceptReject from "./AcceptReject";
import { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Kycabi from "../../../../contracts/kyc.json";

function Request() {
  const [bankRequests, updateBankRequest] = useState([]);

  useEffect(() => {
    const getDetails = async () => {
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const networkData = Kycabi.networks[networkId];
      const kyc = new web3.eth.Contract(Kycabi.abi, networkData.address);
      let acc = web3.currentProvider.selectedAddress;

      await kyc.methods.filterRequests().send({
        from: acc,
        gas: 4700000,
      });

      let a = await kyc.methods.getRequests().call({
        from: acc,
        gas: 4700000,
      });
      updateBankRequest(a);
    };

    getDetails();
  }, []);

  function update(index) {
    const editedBank = bankRequests[index];
    const bankName = editedBank.bankName;
    var newList = bankRequests.filter((bank) => bank.bankName !== bankName);
    newList.concat(editedBank);
    updateBankRequest(newList);
  }

  const onAccept = async (index) => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const networkData = Kycabi.networks[networkId];
    const kyc = new web3.eth.Contract(Kycabi.abi, networkData.address);
    let acc = web3.currentProvider.selectedAddress;
    const editedBank = bankRequests[index];
    await kyc.methods
      .processRequest(editedBank.userName, editedBank.bankAddress, true)
      .send({
        from: acc,
        gas: 4700000,
      });
    update(index);
  };

  const onReject = async (index) => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const networkData = Kycabi.networks[networkId];
    const kyc = new web3.eth.Contract(Kycabi.abi, networkData.address);
    let acc = web3.currentProvider.selectedAddress;
    const editedBank = bankRequests[index];
    await kyc.methods
      .processRequest(editedBank.userName, editedBank.bankAddress, false)
      .send({
        from: acc,
        gas: 4700000,
      });
    update(index);
  };

  return (
    <div className="App">
      <Navbar />
      <br />
      <center>
        <h1
          style={{
            marginLeft: "20px",
          }}
        >
          New requests
        </h1>
      </center>
      {bankRequests.map((request, index) => {
        if (!request.accept && !request.reject) {
          return (
            <AcceptReject
              request={request}
              index={index}
              onAccept={onAccept}
              onReject={onReject}
            />
          );
        } else return null;
      })}
    </div>
  );
}

export default Request;
