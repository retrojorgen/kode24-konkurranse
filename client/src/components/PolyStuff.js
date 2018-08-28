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
`;

const PolyLines = styled.div`
  `;

class PolyStuff extends Component {


  state = {
    lines: []
  };

  addLines (newLines) {
    let lines = this.state.lines;
    lines = lines.concat(newLines);
    this.setState(
      {
        lines: lines
      }
    )
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
    let lines = this.state.lines;
    return (
      <PolyWrapper>
        <PolyLines>
          {lines.map(line => {
            if(line.type === "command") 
              return (<p>☭/&nbsp;{line.content}</p>)
            if(line.type === "error")
              return ( <p>**&nbsp;{line.content}&nbsp;**</p>)
          })}
        </PolyLines>
        <PolyInput sendToParse={this.parseLine.bind(this)}/>
      </PolyWrapper>
    )
  }

}

export default PolyStuff;