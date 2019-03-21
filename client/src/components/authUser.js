import React, { Component } from "react";
import styled from "styled-components";
import {
  isVerified,
  createUser,
  recoverByEmail,
  verifyEmail,
  verifyUsername
} from "../api/authAPI";

const AuthWrapper = styled.div``;

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
      error: ""
    };
  }

  clearUser(user) {
    this.setState({
      inputs: {
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
      }
    });
  }

  componentDidMount() {
    this.isUserLoggedIn();
  }

  async isUserLoggedIn() {
    const user = await isVerified();
    if (user) {
      let inputsCopy = Object.assign({}, this.state);
      inputsCopy.inputs.email.name = user.email;
      inputsCopy.inputs.username.name = user.username;
      inputsCopy.verified = true;
      this.setState(inputsCopy);
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
        inputsCopy.inputs.username.name = emailResponse.user.username;
        inputsCopy.verified = true;
      } else {
        inputsCopy.verified = false;
      }
      this.setState(inputsCopy);
      console.log(emailResponse);
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
        this.setState(inputsCopy);
      }
      console.log(usernameResponse);
    }
  }

  async registerUser() {
    let email = this.state.inputs.email.name;
    let username = this.state.inputs.username.name;
    const createdResponse = createUser(email, username);
    if (createdResponse) {
      return createdResponse;
    } else {
    }
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.state.verified) {
      // user is recovering
      const response = await recoverByEmail(this.state.inputs.email.name);
      // call back to master
      this.props.authUser(response);
    } else {
      const response = await this.state.registerUser();
      this.props.authUser(response);
    }
  }

  render() {
    let inputs = this.state.inputs;
    let verified = this.state.verified;
    return (
      <AuthWrapper>
        <form onSubmit={event => this.handleFormSubmit(event)}>
          {!verified && (
            <>
              <div>
                <input
                  name="e-mail"
                  type="email"
                  value={this.state.inputs.email.name}
                  onChange={event => this.checkEmail(event)}
                />
                <p>{inputs.email.error}</p>
              </div>

              <div>
                <input
                  name="username"
                  type="text"
                  value={this.state.inputs.username.name}
                  onChange={event => this.checkUsername(event)}
                />
                <p>{inputs.username.error}</p>
              </div>
            </>
          )}

          {verified && <button>Logg inn som {inputs.username.name}</button>}
          {!verified && (
            <button
              disabled={
                !inputs.email.name ||
                !inputs.username.name ||
                inputs.email.isUsed ||
                inputs.username.isUsed
              }
            >
              Registrer og logg inn
            </button>
          )}
        </form>
      </AuthWrapper>
    );
  }
}

export default AuthUser;
