import React, { Component } from 'react';
import styled from 'styled-components';

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
    text-shadow: 0 0 20px #0eff00;
    font-family: 'VT323', monospace;
    font-size: 20px;
    border: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
    padding: 0;
    outline: none;
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

const Username = styled.span`
  color: #ff2a00;
  text-shadow: 0 0 20px #ff2a00;
`; 

class Input extends Component {
  state = {
    characters: "",
    previousInputs: [],
    hasFocus: false
  };

  inputRef = React.createRef();

  focusInput () {
    this.inputRef.current.focus();
    this.setState({
      hasFocus: true
    });
  }

  // Sends command typed by user to parsing
  // dumps command in array for later use
  // perhaps implement up on keyboard for repeat?
  sendToParse () {
    let characters = this.state.characters;
    if(this.props.user && !this.props.user.email) {
      this.props.sendToEmail(this.state.characters);
    } else if (this.props.user && this.props.user.email && !this.props.user.username) {
      this.props.sendToUsername(this.state.characters);
    }
    else if(this.props.user && this.props.user.email && this.props.user.username && this.props.user.verified) {
      this.props.sendToParse(this.state.characters);
    }
    
    let previousInputs = this.state.previousInputs;
    previousInputs.push(characters);
    this.setState(
      {
        characters: "",
        previousInputs: previousInputs
      }
    )
  }
  
  // when input field changes update value in state
  updateInput (value) {
    this.setState({
      characters: value
    });
  }
  

  handleKeyDown = (event) => {
    const keyCode = event.keyCode;
    if(keyCode === 13)
      this.sendToParse();
  }

  componentWillMount () {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  render () {

    let pathString = this.props.pathString;
    if(this.props.user && !this.props.user.email) {
      pathString = "Din e-postadresse:";
    } else if (this.props.user && this.props.user.email && !this.props.user.username) {
      pathString = "Ditt kallenavn:";
    }
    else if(this.props.user && this.props.user.email && this.props.user.username && this.props.user.verified) {
      pathString =  `@C:${pathString}>`;
    }
    
    
    
    return (
      <PolyInputContainer onClick={ () => this.focusInput() }>
        <div className={`input-wrapper ${this.state.hasFocus ? '': 'show-info'}`} />
        <div className="path-view">
          {this.props.user && this.props.user.email && this.props.user.username && this.props.user.verified && 
          (<Username>{"[" + this.props.user.username + "]"}</Username>)}
          {pathString}&nbsp;
        </div>
        <input type="text" name="mobile-input" value={this.state.characters} className="mobile-input" ref={this.inputRef} onChange={(event) => this.updateInput(event.target.value)} placeholder="Trykk her for å skrive"/>
      </PolyInputContainer>
    )
  }
}

export default Input;