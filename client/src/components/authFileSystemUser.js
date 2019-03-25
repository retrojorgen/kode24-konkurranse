import React, { Component } from "react";
import styled from "styled-components";
import { loginFileSystemUser, isVerifiedFileSystem } from "../api/authAPI";
import accentureLogo from "../images/accenture-logo.png";
import accentureIcon from "../images/accenture-icon.png";
import { ButtonWrapper } from "./styleComponents";

class AuthFileSystemUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: {
        username: "",
        password: ""
      },
      error: ""
    };
  }

  async authUser(event) {
    event.preventDefault();
    event.stopPropagation();
    let { username, password } = this.state.inputs;
    let loggedInUser = await loginFileSystemUser(username, password);
    if (loggedInUser) {
      this.props.authFileSystemUser(loggedInUser.user);
    } else {
      this.setState({ error: "fant ikke brukeren dessverre.." });
    }
  }

  async componentDidMount() {
    let isVerified = await isVerifiedFileSystem();
    console.log(isVerified, "hest");
    if (isVerified) {
      this.setState({
        inputs: {
          username: isVerified.username,
          password: isVerified.password
        }
      });
    }
  }

  updateInputField(field, value) {
    let inputsCopy = Object.assign({}, this.state);
    inputsCopy.inputs[field] = value;
    this.setState(inputsCopy);
  }

  typeHandler(typeName, event) {
    let email = event.target.value;
    this.updateInputField(typeName, email);
  }

  render() {
    let inputs = this.state.inputs;
    let error = this.state.error;

    return (
      <>
        <h2>Rådhuset login</h2>
        <form
          onSubmit={event => this.authUser(event)}
          name="radhuset"
          id="radhuset"
          autoComplete="new-password"
        >
          <div>
            <input
              name="nick-filesystem"
              type="text"
              value={inputs.username}
              placeholder="Brukernavn"
              autoComplete="new-password"
              onChange={event =>
                this.typeHandler("username", event, () => true)
              }
            />
          </div>
          <div>
            <input
              name="pass-filesystem"
              type="password"
              value={inputs.password}
              placeholder="Passord"
              autoComplete="new-password"
              onChange={event =>
                this.typeHandler("password", event, () => true)
              }
            />
          </div>
          <ButtonWrapper>
            <button disabled={!inputs.username || !inputs.password}>
              <span>logg inn</span>
            </button>
          </ButtonWrapper>
        </form>
      </>
    );
  }
}

export default AuthFileSystemUser;
