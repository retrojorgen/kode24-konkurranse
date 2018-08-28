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

const PolyInputContainer = styled.div`
  bakground-color: transparent;
  border: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  .input {
    position: relative;
    
    &:after {
      content: "";
      position: absolute;
      top: 3px;
      right: -0.7em;
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
            console.log('enter');
            break;
        case BACK_KEY:
            console.log('Back');
            this.removeLastCharacter();
            break;
        case BACK_KEY_ALTERNATIVE:
            console.log('Back');
            this.removeLastCharacter();
            break;        
        default:
            if(event.key.length < 2) 
              this.addKey(event.key.toUpperCase());
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
        <span>☭/&nbsp;</span><span className="input">{typed}</span>
      </PolyInputContainer>
    )
  }

}

export default PolyInput;