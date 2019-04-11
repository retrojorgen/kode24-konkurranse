import React, { Component } from "react";
import styled from "styled-components";

const PolyInputContainer = styled.span`
  bakground-color: transparent;
  border: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  width: 100%;
  .mobile-input {
    flex: 1 1 100%;
    background-color: transparent;
    color: #ff67fa;
    text-shadow: 0 0 20px #0eff00;
    font-family: "VT323", monospace;
    font-size: 20px;
    border: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
    padding: 0;
    outline: none;
    text-align: left;
    &:focus {
      &::placeholder {
        color: transparent;
        text-shadow: 0 0 20px transparent;
      }
    }
  }
  .input-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      transition: all 1s ease-in-out;
      background-color: #ff2a00;
      opacity: 0;
      z-index: 10;
    }
    &.show-info {
      pointer-events: auto;
      cursor: pointer;
      &:before {
        opacity: 1;
        transition: all 1s ease-in-out;
      }
      &:after {
        opacity: 1;
        transition: all 1s ease-in-out;
      }
    }
  }

  .path-view {
    white-space: nowrap;
  }
`;

class Input extends Component {
  state = {
    characters: "",
    previousInputs: [],
    hasFocus: false
  };

  inputRef = React.createRef();

  focusInput() {
    this.inputRef.current.focus();
    this.setState({
      hasFocus: true
    });
  }

  // Sends command typed by user to parsing
  // dumps command in array for later use
  // perhaps implement up on keyboard for repeat?
  sendToParse() {
    let characters = this.state.characters;
    let previousInputs = this.state.previousInputs;
    previousInputs.push(characters);
    this.setState({
      characters: "",
      previousInputs: previousInputs
    });
    this.props.sendToParse(characters);
  }

  // when input field changes update value in state
  updateInput(value) {
    this.setState({
      characters: value
    });
  }

  handleKeyDown = event => {
    const keyCode = event.keyCode;
    if (keyCode === 13) this.sendToParse();
  };

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  render() {
    let pathString = this.props.pathString;
    let hasAnswered = this.props.hasAnswered;
    return (
      <PolyInputContainer onClick={() => this.focusInput()}>
        <div className="path-view">
          {hasAnswered && <>💀</>}~{pathString}$&nbsp;
        </div>
        <input
          type="text"
          name="mobile-input"
          value={this.state.characters}
          className="mobile-input"
          ref={this.inputRef}
          onChange={event => this.updateInput(event.target.value)}
          placeholder="Trykk her for å skrive"
        />
      </PolyInputContainer>
    );
  }
}

export default Input;
