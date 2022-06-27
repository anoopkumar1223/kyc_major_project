import React, { useState, useRef } from "react";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Kycabi from "../../contracts/kyc.json";

const Signup = () => {
  const paperStyle = { padding: 20, width: 500, margin: "0 auto" };
  const headerStyle = { margin: 0 };
  const avatarStyle = { backgroundColor: "#1bbd7e" };

  const [username, setUsername] = useState("");
  const passRef = useRef("");
  const confirmRef = useRef("");

  const onClickSignup = async () => {
    if (passRef.current.value !== confirmRef.current.value) {
      window.alert("Password doesn't match");
      return;
    }
    const web3 = window.web3;
    const acc = web3.currentProvider.selectedAddress;
    const networkId = await web3.eth.net.getId();
    const networkData = Kycabi.networks[networkId];
    if (networkData) {
      const kyc = new web3.eth.Contract(Kycabi.abi, networkData.address);
      try {
        console.log(
          await kyc.methods.addBank(username, passRef.current.value, acc).send({
            from: acc,
            gas: 4700000,
          })
        );
        let a = await kyc.methods.getEventFlag().call();
        if (a == 1)
          window.alert(`An account already exists with the ETH address ${acc}`);
        else window.alert("Bank added successfully");
      } catch (e) {
        window.alert(e);
      }
    } else {
      window.alert("Kyc contract not deployed to detected network.");
    }
  };

  const web3 = window.web3;
  const acc = web3.currentProvider.selectedAddress;
  return (
    <Grid>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h2 style={headerStyle}>Sign Up</h2>
          <Typography variant="caption" gutterBottom>
            Please fill this form to create an account !
          </Typography>
        </Grid>

        <TextField
          fullWidth
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <TextField
          fullWidth
          label="Password"
          placeholder="Enter your password"
          inputRef={passRef}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          placeholder="Enter your password"
          inputRef={confirmRef}
        />
        <br />
        <br />
        <Typography>You are signing in using account: </Typography>
        <Typography>{acc}</Typography>
        <br />

        <FormControlLabel
          control={<Checkbox name="checkedA" />}
          label="I accept the terms and conditions."
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={onClickSignup}
        >
          Sign up
        </Button>
      </Paper>
    </Grid>
  );
};

export default Signup;
