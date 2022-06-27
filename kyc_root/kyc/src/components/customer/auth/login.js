import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "./auth_navbar";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Kycabi from "../../../contracts/kyc.json";

const Login = ({ handleChange }) => {
  const paperStyle = {
    padding: 20,
    width: 500,
    margin: "0 auto",
  };

  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const btnstyle = { margin: "8px 0" };
  const web3 = window.web3;
  const acc = web3.currentProvider.selectedAddress;

  const [username, setUsername] = useState("");
  const passRef = useRef("");
  const [a, setA] = useState();

  const onClickLogin = async () => {
    const networkId = await web3.eth.net.getId();
    const networkData = Kycabi.networks[networkId];
    if (networkData) {
      const kyc = new web3.eth.Contract(Kycabi.abi, networkData.address);
      let b = await kyc.methods
        .verifyCustomer(username, passRef.current.value)
        .call({ from: acc, gas: 4700000 });
      setA(b);
      if (b == 1) {
        window.alert("Wrong password");
      } else if (b == 2) {
      } else if (b == 3) {
        window.alert(
          "Selected metamask ETH address doesn't match with user address"
        );
      } else if (b == 0) window.alert("Customer data doesn't exists!");
    } else {
      window.alert("Kyc contract not deployed to detected network.");
    }
  };
  let navigate = useNavigate();
  return (
    <div>
      <AuthNavbar />
      <Grid>
        <Paper style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
            <h2>Sign In</h2>
          </Grid>
          <TextField
            label="Username"
            placeholder="Enter username"
            fullWidth
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <TextField
            label="Password"
            placeholder="Enter password"
            type="password"
            fullWidth
            required
            inputRef={passRef}
          />
          <br />
          <br />
          <Typography>You are signing up using account: </Typography>
          <Typography>{acc}</Typography>
          <br />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={btnstyle}
            fullWidth
            onClick={async () => {
              onClickLogin();
              if (a == 2) {
                const networkId = await web3.eth.net.getId();
                const networkData = Kycabi.networks[networkId];
                const kyc = new web3.eth.Contract(
                  Kycabi.abi,
                  networkData.address
                );
                await kyc.methods
                  .setActiveCustomer(username)
                  .send({ from: acc, gas: 4700000 });
                window.alert("Login successful");
                navigate("/customer_home/profile", { replace: true });
              }
            }}
          >
            Sign in
          </Button>
        </Paper>
      </Grid>
    </div>
  );
};

export default Login;
