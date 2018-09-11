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
  display: flex;
  width: 100%;
  .mobile-input {
    flex: 1 1 100%;
    background-color: transparent;
    color: #0dff00;
    font-family: 'VT323', monospace;
    font-size: 20px;
    border: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
    padding: 0;
    outline: none;
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

  .path-view {
    white-space: nowrap;
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
    this.setState({
      hasFocus: true
    });
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
    let pathString = this.props.pathString;
    return (
      <PolyInputContainer onClick={() => {
          this.focusInput()
        }
        }>
        <div className={`input-wrapper ${this.state.hasFocus ? '': 'show-info'}`}>
          
        </div>
        
        <div className="path-view">C:\{pathString}>&nbsp;</div>
        <input name="mobile-input" value={this.state.characters} className="mobile-input" ref={this.inputRef} onChange={(event) => this.updateInput(event.target.value)} />
      </PolyInputContainer>
    )
  }

}

export default PolyInput;