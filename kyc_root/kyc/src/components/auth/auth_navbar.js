import React, { Component } from "react";
import "../navbar/Navbar.css";

class AuthNavbar extends Component {
  state = { clicked: false };

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  render() {
    return (
      <div>
        <nav className="NavbarItems">
          <h1 className="navbar-logo">
            KYC DAPP<i className="fab fa-ethereum"></i>
          </h1>
        </nav>
        <br />
        <center>
          <h1>Bank Portal</h1>
        </center>
      </div>
    );
  }
}

export default AuthNavbar;
