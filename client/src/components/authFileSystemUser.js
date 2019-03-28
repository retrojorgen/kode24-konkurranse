import React, { Component } from "react";
import { loginFileSystemUser, isVerifiedFileSystem } from "../api/authAPI";
import { ButtonWrapper } from "./styleComponents";
import RadhusLogo from "../images/radhus-ascii-logo.png";
import styled from "styled-components";
import { submitFileSystemUsernameAndPassword } from "./socketConnection";

const RadHusFormWrapper = styled.div`
  color: #ff67fa;
  text-shadow: 0 0 20px #ff67fa;
  h2 {
    color: #ff67fa;
  }
  input {
    color: #ff67fa;
    border: 0;
    border-bottom: 2px solid #ff67fa;
    background: transparent;
  }
`;

const RadHusButton = styled(ButtonWrapper)`
  button {
    color: white;
    span {
      background-color: #ff67fa;
    }
    &:before {
      background-color: white;
    }
  }
`;

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
    this.props.loading(true);

    setTimeout(() => {
      if (loggedInUser) {
        submitFileSystemUsernameAndPassword(
          loggedInUser.user.username,
          loggedInUser.user.password
        );
        this.props.authFileSystemUser(loggedInUser.user);
      } else {
        this.setState({ error: "fant ikke brukeren dessverre.." });
      }
      this.props.loading(false);
    }, 1000);
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
      <RadHusFormWrapper>
        <div style={{ maxWidth: "100%", marginTop: "20px" }}>
          <img src={RadhusLogo} alt="radhuslogo" style={{ maxWidth: "80%" }} />
        </div>
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
          {error && <p>{error}</p>}
          <RadHusButton>
            <button disabled={!inputs.username || !inputs.password}>
              <span>logg inn</span>
            </button>
          </RadHusButton>
        </form>
      </RadHusFormWrapper>
    );
  }
}

export default AuthFileSystemUser;
