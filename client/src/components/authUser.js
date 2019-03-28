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
import { ButtonWrapper } from "./styleComponents";

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

const AccentureLoginWrap = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  background: #d2d2d2;
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

      this.authUser(createdResponse);
    } else {
    }
  }

  async changeUser() {
    this.clearUser();
  }

  authUser(user) {
    this.props.loading(true);
    setTimeout(() => {
      this.props.authUser(user);
      this.props.loading(false);
    }, 1000);
  }

  loginWithUser() {
    this.authUser(this.state.user);
  }

  render() {
    let inputs = this.state.inputs;
    let userstate = this.state.userstate;
    let user = this.state.user;
    return (
      <AccentureLoginWrap>
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
      </AccentureLoginWrap>
    );
  }
}

export default AuthUser;
