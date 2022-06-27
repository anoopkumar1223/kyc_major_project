import React from "react";

export default function ViewCustomer(props) {
  return (
    <div
      style={{
        marginLeft: "20px",
      }}
    >
      <div>
        <h3>Username : {props.CustomerDetails[0]}</h3>
      </div>
      <div>
        <h3>First Name : {props.CustomerDetails[1]}</h3>
      </div>
      <div>
        <h3>Last Name : {props.CustomerDetails[2]}</h3>
      </div>
      <div>
        <h3>DOB : {props.CustomerDetails[3]}</h3>
      </div>
      <div>
        <h3>Phone : {props.CustomerDetails[4]}</h3>
      </div>
      <div>
        <h3>Email : {props.CustomerDetails[5]}</h3>
      </div>
      <div>
        <h3>Address : {props.CustomerDetails[6]}</h3>
      </div>
      <div>
        <h3>Aadhar Number : {props.CustomerDetails[7]}</h3>
      </div>
      <div>
        <h3>Pan Number : {props.CustomerDetails[8]}</h3>
      </div>
      <div>
        <h3>ETH address : {props.CustomerDetails[10]}</h3>
      </div>
      <div>
        <h3>Verified by Bank : {props.CustomerDetails[11]}</h3>
      </div>
    </div>
  );
}
