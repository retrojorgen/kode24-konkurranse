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
      background-color: white;
      animation: ${blinking} 1s linear infinite;
    }
  }
`;

class PolyInput extends Component {
  state = {
    characters: []
  };

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
      this.setState(
        {
          characters: characters
        }
      )
    }
    

  }

  sendToParse () {
    this.props.sendToParse(this.state.characters);
    this.setState(
      {
        characters: []
      }
    )
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
        case BACK_KEY:;
            this.removeLastCharacter();
            break;
        case BACK_KEY_ALTERNATIVE:
            this.removeLastCharacter();
            break;        
        default:
            if(event.key.length < 2) {
              this.addKey(key.toUpperCase());
            }
            break;
    }
  }

  componentWillMount () {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  render () {
    let typed = this.state.characters;
    return (
      <PolyInputContainer>
        <span className="input">{typed.join('')}</span>
      </PolyInputContainer>
    )
  }

}

export default PolyInput;