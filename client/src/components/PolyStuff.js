import React, { Component } from 'react';
import styled from 'styled-components';
import PolyInput from './PolyInput';

const PolyWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  font-size: 20px;
  text-shadow: 0 1px 2px rgba(102, 0, 204, 0.6);
  overflow: hidden;
  p {
    margin: 0;
    text-transform: uppercase;
  }
  &:before {
    content: "";
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 60px black inset;
  }
  &:after {
    content: "";
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(#00000000,#0000003b 2px,#0000005e 2px,#00000000 4px);
  }
`;

const PolyLines = styled.div`
  `;

const PolyInputWrapper = styled.div`
`;  

class PolyStuff extends Component {


  state = {
    lines: []
  };

  addLines (newLines) {
    console.log('adding lines', newLines);
    let lines = this.state.lines;
    lines = lines.concat(newLines);
    this.setState(
      {
        lines: lines
      }
    )
  }

  componentDidMount () {
    console.log('hest');
    this.addLines([
          {"type": "regular", content: "╔═ SZTAKI PolyTechnica ═╗"},
          {"type": "regular", content: "║........Szervusz!.......║"},
          {"type": "regular", content: "║....böngésző terminál...║"},
          {"type": "regular", content: "╠════════════════╣"},
          {"type": "regular", content: "║.....User as logged.....║"},
          {"type": "regular", content: "║.......Marco Zseni......║"},
          {"type": "regular", content: "╚════════════════╝"},
          {"type": "regular", content: "For hielp type help"},
          {"type": "regular", content: "***"},
          {"type": "regular", content: "**"},
          {"type": "regular", content: "*"}
    ])
  }

  parseLine (line) {
    let lines = [{
      type: "command",
      content: line
    }];
    lines.push({
      type: "error",
      content: "These lines can no be parseables"
    });
    this.addLines(lines);
  }

  render () {
    console.log('lines', this.state.lines);
    let lines = this.state.lines;
    return (
      <PolyWrapper>
        <PolyLines>
          {lines.map((line, index) => {
            if(line.type === "command") 
              return (<p key={index}>☭/>&nbsp;{line.content}</p>)
            if(line.type === "error")
              return ( <p key={index}>**&nbsp;{line.content}&nbsp;**</p>)
              if(line.type === "regular")
              return ( <p key={index}>{line.content}</p>)  
            return (<p key={index}></p>);  
          })}
        </PolyLines>
        <PolyInputWrapper>
          <span>☭/>&nbsp;</span><PolyInput sendToParse={this.parseLine.bind(this)}/>
        </PolyInputWrapper>
      </PolyWrapper>
    )
  }

}

export default PolyStuff;