import React, { Component } from "react";
import styled from "styled-components";
import {
  isVerified,
  createUser,
  recoverByEmail,
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
          isUsed: false
        },
        username: {
          name: "",
          error: "",
          isUsed: false
        }
      },
      verified: false,
      error: "",
      userstate: "loginMenu",
      user: {
        email: "",
        username: "",
        points: ""
      }
    };
  }

  clearUser(user) {
    this.setState({
      inputs: {
        email: {
          name: "",
          error: "",
          isUsed: false,
          hasBeenEdited: false
        },
        username: {
          name: "",
          error: "",
          isUsed: false,
          hasBeenEdited: false
        }
      },
      user: {
        email: "",
        username: "",
        points: ""
      },

      verified: false,
      error: "",
      userstate: "loginMenu"
    });
  }

  gotoMenu(state) {
    if (state == "newLogin") this.clearUser();
    this.setState({
      userstate: state
    });
    console.log(this.state);
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

  async checkEmail(event) {
    let email = event.target.value;
    let inputsCopy = Object.assign({}, this.state);
    inputsCopy.inputs.email.name = email;
    this.setState(inputsCopy);
    if (email) {
      const emailResponse = await verifyEmail(email);
      if (emailResponse) {
        inputsCopy.inputs.email.isUsed = true;
        inputsCopy.user = emailResponse.user;
      } else {
        inputsCopy.inputs.email.isUsed = false;
        inputsCopy.user = {
          email: "",
          username: "",
          points: ""
        };
      }
      this.setState(inputsCopy);
    }
  }

  async checkUsername(event) {
    let username = event.target.value;
    let inputsCopy = Object.assign({}, this.state);
    inputsCopy.inputs.username.name = username;
    this.setState(inputsCopy);
    if (username) {
      const usernameResponse = await verifyUsername(username);
      if (usernameResponse) {
        inputsCopy.inputs.username.isUsed = true;
      } else {
        inputsCopy.inputs.username.isUsed = false;
      }
      this.setState(inputsCopy);
    }
  }

  async registerUser(event) {
    event.preventDefault();
    event.stopPropagation();
    let email = this.state.inputs.email.name;
    let username = this.state.inputs.username.name;
    const createdResponse = createUser(email, username);
    if (createdResponse) {
      return createdResponse;
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
    let verified = this.state.verified;
    let userstate = this.state.userstate;
    let user = this.state.user;
    console.log(user);

    return (
      <AuthWrapper>
        <AuthContainer>
          <AccentureLogo>
            <img src={accentureIcon} class="accenture-icon" />
            <img src={accentureLogo} class="accenture-logo" />
          </AccentureLogo>
          <h2>Proxy</h2>
          {userstate == "loginMenu" && (
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
          {userstate == "loginWithUser" && (
            <>
              <form onSubmit={event => this.loginWithUser(event)}>
                <div>
                  <input
                    name="e-mail"
                    type="email"
                    value={this.state.inputs.email.name}
                    onChange={event => this.checkEmail(event)}
                    placeholder="E-postadresse"
                  />
                  {inputs.email && !inputs.email.isUsed && (
                    <p>Fant ingen bruker som heter det</p>
                  )}
                </div>
                <ButtonWrapper>
                  <button disabled={!user.email || !user.username}>
                    <span>
                      {user.username && <>Logg inn som {user.username}</>}
                      {!user.username && <>Logg inn</>}
                    </span>
                  </button>
                </ButtonWrapper>
              </form>
            </>
          )}
          {userstate == "newLogin" && (
            <>
              <form onSubmit={event => this.registerUser(event)}>
                <div>
                  <input
                    name="e-mail"
                    type="email"
                    value={this.state.inputs.email.name}
                    placeholder="E-postadresse"
                    onChange={event => this.checkEmail(event)}
                  />

                  {inputs.email.isUsed && (
                    <p>
                      Denne e-postadressen er allerede i bruk. Er det deg? Gå
                      tilbake til login.
                    </p>
                  )}
                </div>
                <div>
                  <input
                    name="username"
                    type="text"
                    value={this.state.inputs.username.name}
                    placeholder="Brukernavn"
                    onChange={event => this.checkUsername(event)}
                  />
                  {inputs.username.isUsed && (
                    <p>Dette brukernavnet er allerede i bruk.</p>
                  )}
                </div>
                <ButtonWrapper>
                  <button
                    disabled={inputs.email.isUsed || inputs.username.isUsed}
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
