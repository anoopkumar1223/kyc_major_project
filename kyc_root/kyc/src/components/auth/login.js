import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import Kycabi from "../../contracts/kyc.json";

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
      console.log(username, passRef.current.value, acc);
      let b = await kyc.methods
        .checkBank(username, passRef.current.value, acc)
        .call({ from: acc, gas: 4700000 });
      setA(b);
      console.log(a);
      if (a === "0") {
      } else if (a === "-1") window.alert("Please signup first");
    } else {
      window.alert("Kyc contract not deployed to detected network.");
    }
  };
  let navigate = useNavigate();
  return (
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
            if (a == 0) {
              const networkId = await web3.eth.net.getId();
              const networkData = Kycabi.networks[networkId];
              const kyc = new web3.eth.Contract(
                Kycabi.abi,
                networkData.address
              );
              await kyc.methods
                .setBankActiveAddress(acc)
                .send({ from: acc, gas: 4700000 });
              window.alert("Login successful");
              navigate("../bank_home/add_kyc", {
                replace: true,
              });
            }
          }}
        >
          Sign in
        </Button>
        <Typography>
          {" "}
          Do you have an account ?
          <Link href="#" onClick={() => handleChange("event", 1)}>
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Login;
