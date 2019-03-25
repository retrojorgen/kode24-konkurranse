import React, { Component } from "react";
import styled from "styled-components";
import { loginFileSystemUser } from "../api/authAPI";
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
    background: black;
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
  * {
    position: relative;
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
    color: #00ffad;
    text-transform: lowercase;
    font-size: 100px;
    text-shadow: 4px 4px 0px black;
    margin: 0;
  }
  h2 {
    color: #00ffad;
    text-shadow: none;
  }
  form {
    width: 100%;
  }
  div {
    width: 100%;
  }
  input {
    width: 100%;
    display: block;
    font-size: 20px;
    padding: 20px 10px;
    margin-bottom: 20px;
    text-align: center;
    text-transform: uppercase;
    font-family: "VT323", monospace;
    &::placeholder {
      font-family: "VT323", monospace;
      color: #00ffad;
    }
    border: 4px solid #00ffad;
    background-color: black !important;
    color: #00ffad !important;
    &:-internal-autofill-previewed {
      border: 4px solid #00ffad;
      background-color: black !important;
      color: #00ffad !important;
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
    color: black;
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
      border: 4px solid #00ffad;
      background-color: black;
      color: #00ffad;
      transition: all 100ms ease-in-out;
    }
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #009062;
      transform: translateX(6px) translateY(6px);
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

  loginWithUser() {
    this.props.authUser(this.state.user);
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
      <AuthWrapper>
        <AuthContainer>
          <h2>Rådhuset login</h2>
          <form onSubmit={event => this.loginFileSystemUser(event)}>
            <div>
              <input
                name="username-filesystem"
                type="text"
                value={inputs.username}
                placeholder="Brukernavn"
                autoComplete="off"
                onChange={event =>
                  this.typeHandler("username", event, () => true)
                }
              />
            </div>
            <div>
              <input
                name="password-filesystem"
                type="password"
                value={inputs.password}
                placeholder="Passord"
                autoComplete="off"
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
        </AuthContainer>
      </AuthWrapper>
    );
  }
}

export default AuthFileSystemUser;
