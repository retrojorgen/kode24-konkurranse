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
      error: ""
    };
  }

  clearUser(user) {
    this.setState({
      user: {
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

  _isVerified() {
    isVerified(user => this.setAsVerified(user));
  }

  componentDidMount() {
    // call to see if user is verified
  }

  _recoverByEmail(email) {
    recoverByEmail(email, user => this.props.authUser(user));
  }

  _validateUsername(username) {
    if (username.length > 20) {
      this.addErrorLine("Kallenavn må være kortere enn 20 tegn");
    } else {
      verifyUsername(
        username,
        () => {
          this.addErrorLine("Kallenavn er allerede i bruk");
        },
        () => {
          let user = this.state.user;
          user.username = username;
          this.setState({
            user: user
          });
          this.addLines({
            type: "txt",
            content: [
              `Kallenavn ${username} er godkjent!`,
              `Logger deg inn kompis..`
            ]
          });
          createUser(user.email, user.username, user => {
            this.addLines({
              type: "txt",
              content: [`Velkommen ${username}`, "Du har foreløpig 0 poeng."]
            });

            this.setState({
              user: {
                email: user.email,
                username: user.username,
                verified: true
              }
            });
          });
        }
      );
    }
  }

  render() {
    let user = this.state.user;
    return (
      <AuthWrapper>
        <form>
          <input name="e-mail" type="email" />
          <input name="username" type="text" />
          {user.verified && <button>Logg inn</button>}
          {user.verified && <button>Logg inn</button>}
          {!user.verified && <button>Registrer og logg inn</button>}
        </form>
      </AuthWrapper>
    );
  }
}

export default AuthUser;
