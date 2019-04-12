import React, { Component } from "react";
import { loginFileSystemUser, isVerifiedFileSystem } from "../api/authAPI";
import { ButtonWrapper } from "./styleComponents";
import styled from "styled-components";
import { submitFileSystemUsernameAndPassword } from "./socketConnection";

const RadHusFormWrapper = styled.div`
  color: #ff67fa;
  text-shadow: 0 0 20px #ff67fa;
  background-color: black;
  h2 {
    color: #ff67fa;
  }
  input {
    color: #ff67fa;
    border: 0;
    border-bottom: 2px solid #ff67fa;
    background: transparent;
  }
  padding: 20px;
  @media (min-width: 980px) {
    width: 800px;
    height: 600px;
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
    submitFileSystemUsernameAndPassword(username, password);
    let loggedInUser = await loginFileSystemUser(username, password);
    this.props.loading(true);

    setTimeout(() => {
      if (loggedInUser) {
        this.props.authFileSystemUser(loggedInUser.user);
      } else {
        this.setState({ error: "Feil i brukernavn eller passord.." });
      }
      this.props.loading(false);
    }, 1000);
  }

  async componentDidMount() {
    let isVerified = await isVerifiedFileSystem();
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
        <div>
          <img
            src="https://paaske2019.kode24.no/radhus.jpg"
            alt="radhuslogo"
            style={{ maxWidth: "80%" }}
          />
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
              placeholder="Skriv brukernavn"
              autoComplete="new-password"
              onChange={event =>
                this.typeHandler("username", event, () => true)
              }
            />
          </div>
          <div>
            <input
              name="pass-filesystem"
              type="text"
              value={inputs.password}
              placeholder="Skriv passord"
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
