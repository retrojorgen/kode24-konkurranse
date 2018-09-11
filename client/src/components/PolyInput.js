import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

const blinking = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 1;
  }

  60% {
    opacity: 0;
  }

  90% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
const PolyInputContainer = styled.span`
  bakground-color: transparent;
  border: 0;
  padding-top: 10px;
  padding-bottom: 10px;
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
    &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        transition: all 1s ease-in-out;
        background-color: green;
        opacity: 0;
        z-index: 10;
      }
      &:after {
        content: "Logg inn på Toms maskin";
        max-width: 100px;
        text-align: center;
        border-bottom: 1px solid rgba(255,255,255,1);
        background-color: black;
        color: white;
        font-size: 1.4em;
        display: inline-block;
        padding: 10px 20px;
        border-radius: 4px;
        transition: all 1s ease-in-out;
        opacity: 0;
        position: relative;
        z-index: 11;
      }
    &.show-info {
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
  .mobile-input {
    position: absolute;
    left: 400%;
    bottom: 0;
    opacity: 0;
  }
  .input {
    position: relative;
    white-space: pre; 
    &:after {
      content: "";
      position: absolute;
      top: 3px;
      right: -0.4em;
      width: 10px;
      height: 16px;
      background-color: #73e36d;
      animation: ${blinking} 1s linear infinite;
    }
  }
`;

class PolyInput extends Component {
  state = {
    characters: "",
    previousInputs: [],
    hasFocus: false
  };

  inputRef = React.createRef();

  focusInput () {
    console.log('setting focus');
    this.inputRef.current.focus();
  }

  removeLastCharacter () {
    let characters = this.state.characters;
    if(characters.length) {
      characters.pop();
      this.setState(
        {
          characters: characters
        }
      );
    }
  }

  addKey (key) {
    if(key === " ") {
      key = '\u0020';
    }
    let characters = this.state.characters;
    if(characters.length < 100) {
      characters.push(key);
      
    }
    

  }

  sendToParse () {
    let characters = this.state.characters;
    this.props.sendToParse(this.state.characters);
    let previousInputs = this.state.previousInputs;
    previousInputs.push(characters);
    this.setState(
      {
        characters: "",
        previousInputs: previousInputs
      }
    )
  }
  updateInput (value) {
    this.setState({
      characters: value
    });
  }

  handleKeyDown = (event) => {
    const keyCode = event.keyCode;
    const key = event.key.toString();
    const ENTER_KEY = 13;
    const BACK_KEY = 91;
    const BACK_KEY_ALTERNATIVE = 8;

    switch( keyCode ) {
        case ENTER_KEY:
            this.sendToParse();
            break;
    }
  }

  componentWillMount () {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  render () {
    let typed = this.state.characters;
    return (
      <PolyInputContainer onClick={() => {
          console.log('hest');
          this.focusInput()
        }
        }>
        <div className={`input-wrapper ${this.state.hasFocus ? '': 'show-info'}`}>
          <input name="mobile-input" value={this.state.characters} className="mobile-input" ref={this.inputRef} onChange={(event) => this.updateInput(event.target.value)} />
        </div>
        <span className="input">{typed}</span>
      </PolyInputContainer>
    )
  }

}

export default PolyInput;