import React, { Component } from "react";
import styled from "styled-components";
import {
  isVerified,
  createUser,
  verifyEmail,
  verifyUsername
} from "../api/authAPI";
import accentureLogo from "../images/accenture-logo.png";
import accentureIcon from "../images/accenture-icon.png";
const AccentureLogo = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    width: auto;
  }
  .accenture-icon {
    width: 40px;
    margin-left: 40px;
  }
`;
const AuthWrapper = styled.div`
  background: #a100ff;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const AuthContainer = styled.div`
  &:before {
    content: "";
    pointer-events: none;
    position: absolute;
    left: 10px;
    top: 10px;
    width: calc(100% - 28px);
    height: calc(100% - 28px);
    border: 4px solid black;
  }
  &:after {
    content: "Accenture proxy";
    pointer-events: none;
    position: absolute;
    left: 50%;
    top: 5px;
    text-transform: uppercase;
    color: white;
    background-color: black;
    padding: 4px;
    width: auto;
    height: auto;
    transform: translateX(-40px);
  }
  color: #a100ff;
  text-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-transform: uppercase;

  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 800px;
  max-height: 600px;
  background: #d2d2d2;
  box-shadow: 20px 26px 0px black;
  padding: 40px;
  position: relative;
  h1 {
    color: white;
    text-transform: lowercase;
    font-size: 100px;
    text-shadow: 4px 4px 0px black;
    margin: 0;
  }
  h2 {
    color: black;
    text-shadow: none;
  }
  form {
    width: 100%;
  }
  div {
    width: 100%;
  }
  input {
    border: 4px solid black;
    width: 100%;
    display: block;
    color: black;
    font-size: 20px;
    padding: 20px 10px;
    margin-bottom: 20px;
    text-align: center;
    text-transform: uppercase;
    font-family: "VT323", monospace;
    &::placeholder {
      font-family: "VT323", monospace;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: space-between;
  justify-content: center;

  button {
    background: transparent;
    text-transform: uppercase;
    color: white;
    font-family: "VT323", monospace;
    font-size: 20px;
    border: 0;
    width: auto;
    margin-bottom: 20px;
    position: relative;
    height: 60px;
    min-width: 200px;
    margin: 10px;
    &:disabled {
      color: rgba(255, 255, 255, 0.4);
    }
    &:hover {
      span {
        transform: translateX(-2px) translateY(-2px);
        transition: all 100ms ease-in-out;
      }
    }
    cursor: pointer;
    span {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: black;
      transition: all 100ms ease-in-out;
    }
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #a7a7a7;
      transform: translateX(6px) translateY(6px);
    }
  }
`;

class AuthUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: {
        isAlreadyLoggedIn: false,
        email: {
          name: "",
          error: "",
          status: 0
        },
        username: {
          name: "",
          error: "",
          status: 0
        }
      },
      verified: false,
      error: "",
      userstate: "loginMenu",
      user: {
        email: "",
        username: "",
        points: ""
      },
      typeHandlers: {}
    };
  }

  clearUser(user) {
    this.setState({
      inputs: {
        email: {
          name: "",
          error: "",
          status: 0
        },
        username: {
          name: "",
          error: "",
          status: 0
        }
      },

      verified: false,
      error: "",
      userstate: "loginMenu",
      user: {
        email: "",
        username: "",
        points: ""
      },
      typeHandlers: {}
    });
  }

  gotoMenu(state) {
    if (state === "newLogin") this.clearUser();
    this.setState({
      userstate: state
    });
  }

  componentDidMount() {
    this.isUserLoggedIn();
  }

  async isUserLoggedIn() {
    const user = await isVerified();
    if (user) {
      this.setState({ user: user });
    }
  }

  async updateInputField(field, value) {
    let inputsCopy = Object.assign({}, this.state);
    inputsCopy.inputs[field].name = value;
    this.setState(inputsCopy);
  }

  async typeHandler(typeName, event, callback) {
    let email = event.target.value;
    this.updateInputField(typeName, email);

    let typeHandlers = this.state.typeHandlers;
    if (typeHandlers.typeName) clearTimeout(typeHandlers.typeName);
    typeHandlers.typeName = setTimeout(() => {
      this[callback](email);
    }, 500);
  }

  async checkEmail(email) {
    let inputsCopy = Object.assign({}, this.state);
    this.setState(inputsCopy);
    if (email) {
      const emailResponse = await verifyEmail(email);
      if (emailResponse) {
        inputsCopy.inputs.email.status = 1;
        inputsCopy.user = emailResponse.user;
      } else {
        inputsCopy.inputs.email.status = 2;
        inputsCopy.user = {
          email: "",
          username: "",
          points: ""
        };
      }
    } else {
      inputsCopy.inputs.email.status = 0;
      inputsCopy.user = {
        email: "",
        username: "",
        points: ""
      };
    }
    this.setState(inputsCopy);
  }

  async checkUsername(username) {
    let inputsCopy = Object.assign({}, this.state);
    inputsCopy.inputs.username.name = username;
    this.setState(inputsCopy);
    if (username) {
      const usernameResponse = await verifyUsername(username);
      if (usernameResponse) {
        inputsCopy.inputs.username.status = 1;
      } else {
        inputsCopy.inputs.username.status = 2;
      }
    } else {
      inputsCopy.inputs.username.status = 0;
    }
    this.setState(inputsCopy);
  }

  async registerUser(event) {
    event.preventDefault();
    event.stopPropagation();
    let email = this.state.inputs.email.name;
    let username = this.state.inputs.username.name;
    const createdResponse = await createUser(email, username);
    if (createdResponse) {
      console.log("created user", createdResponse);
      this.props.authUser(createdResponse);
    } else {
    }
  }

  async changeUser() {
    this.clearUser();
  }

  loginWithUser() {
    this.props.authUser(this.state.user);
  }

  render() {
    let inputs = this.state.inputs;
    let userstate = this.state.userstate;
    let user = this.state.user;

    return (
      <AuthWrapper>
        <AuthContainer>
          <AccentureLogo>
            <img
              src={accentureIcon}
              alt="accenture ikon"
              className="accenture-icon"
            />
            <img
              src={accentureLogo}
              alt="accenture logo"
              className="accenture-logo"
            />
          </AccentureLogo>
          <h2>Proxy</h2>
          {userstate === "loginMenu" && (
            <ButtonWrapper>
              {user.username && user.email && (
                <button onClick={() => this.loginWithUser()}>
                  <span>Logg inn som {user.username}</span>
                </button>
              )}
              {!user.username && (
                <button onClick={() => this.gotoMenu("loginWithUser")}>
                  <span>Logg inn</span>
                </button>
              )}
              <button onClick={() => this.gotoMenu("newLogin")}>
                <span>Ny bruker</span>
              </button>
            </ButtonWrapper>
          )}
          {userstate === "loginWithUser" && (
            <>
              <form onSubmit={event => this.loginWithUser(event)}>
                <div>
                  <input
                    name="e-mail"
                    type="email"
                    value={this.state.inputs.email.name}
                    onChange={event =>
                      this.typeHandler("email", event, "checkEmail")
                    }
                    placeholder="E-postadresse"
                  />
                  {inputs.email.name && !inputs.email.status === 1 && (
                    <p>Fant ingen bruker som heter det {inputs.email.name}</p>
                  )}
                </div>
                <ButtonWrapper>
                  <button
                    disabled={
                      !user.email ||
                      !user.username ||
                      inputs.email.status === 0 ||
                      inputs.email.status === 2
                    }
                  >
                    <span>
                      {user.username && <>Logg inn som {user.username}</>}
                      {!user.username && <>Logg inn</>}
                    </span>
                  </button>
                  <button onClick={() => this.gotoMenu("loginMenu")}>
                    <span>tilbake</span>
                  </button>
                </ButtonWrapper>
              </form>
            </>
          )}
          {userstate === "newLogin" && (
            <>
              <form onSubmit={event => this.registerUser(event)}>
                <div>
                  <input
                    name="e-mail"
                    type="email"
                    value={this.state.inputs.email.name}
                    placeholder="E-postadresse"
                    onChange={event =>
                      this.typeHandler("email", event, "checkEmail")
                    }
                  />

                  {inputs.email.status === 1 && (
                    <p>
                      Denne e-postadressen er allerede i bruk. Er det deg? Gå
                      tilbake for å logge inn så fall.
                    </p>
                  )}
                </div>
                <div>
                  <input
                    name="username"
                    type="text"
                    value={this.state.inputs.username.name}
                    placeholder="Brukernavn"
                    onChange={event =>
                      this.typeHandler("username", event, "checkUsername")
                    }
                  />
                  {inputs.username.status === 1 && (
                    <p>Dette brukernavnet er allerede i bruk.</p>
                  )}
                </div>
                <ButtonWrapper>
                  <button
                    disabled={
                      inputs.email.status === 1 ||
                      inputs.username.status === 1 ||
                      inputs.email.status === 0 ||
                      inputs.username.status === 0
                    }
                  >
                    <span>Opprett bruker</span>
                  </button>
                  <button onClick={() => this.gotoMenu("loginMenu")}>
                    <span>tilbake</span>
                  </button>
                </ButtonWrapper>
              </form>
            </>
          )}
        </AuthContainer>
      </AuthWrapper>
    );
  }
}

export default AuthUser;
