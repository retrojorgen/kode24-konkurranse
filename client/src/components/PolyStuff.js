import React, { Component } from 'react';
import styled from 'styled-components';
import PolyInput from './PolyInput';
import { getHelp, getListFromDirectory, checkPath, getContentsOfFile } from '../api/FileSystem';

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
  text-transform: uppercase;
  .photo {
    img {
      width: 200px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
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
    lines: [],
    path: ["home"],
    lastCommand: ""
  };

  getPathString () {
    
    let pathString = this.state.path.join("/") + "/";
    console.log(this.state.path, pathString);
    return pathString;
  }

  addLines (newLines) {
    let lines = this.state.lines;
    lines = lines.concat(newLines);
    this.setState(
      {
        lines: lines
      }
    )
  }

  clearLines () {
    this.setState(
      {
        lines: []
      }
    )
  }

  _getHelp() {
    getHelp((response) => {
      this.addLines(response);
    })
  }

  componentDidMount () {
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

  addErrorLine (errorMessage) {
    this.addLines([
      {
        type: "error",
        content: errorMessage
      }
    ]);
  }

  setPath (path) {
    this.setState({
      path: path
    });
    if(!this.state.path.length) {
      this.setState({
        path: ["home"]
      })
    }
  }

  
  changePath (path) {
    checkPath(path, (response) => {
      this.setPath(response.path);
    }, () => {
      this.addErrorLine("No directory of this exists");
    })
  }

  
  _getListFromDirectory () {
    getListFromDirectory(this.getPathString(), (response) => {
      this.addLines(response);
    })
  }

  _getContentsOfFile (file) {
    getContentsOfFile(this.getPathString(), file, (response) => {
      this.addLines(response);
    }, () => {
      this.addErrorLine("File not to be found");
    })
  }

  _parsePathRequest (path) {
    if(path === "..") {
      if(this.state.path.length <= 1) {
        this.addErrorLine("Stay in homes please");
      } else {
        let newPath = this.state.path.slice(0);
        newPath.pop();
        this.setState({path: newPath});
      }
    } else {
      this.changePath(this.getPathString() + path);
    }
  }

  parseLine (line) {

    this.addLines({
      type: "command",
      path: this.getPathString(),
      content: line
    });


    line = line.join('');
    let lineContent = line.split(" ");
    if(lineContent.length > 2) {
      this.addErrorLine("Too many commands to understand");
      return;  
    }

    switch (lineContent[0]) {
      case "HELP":
        this._getHelp();
        break;
      case "CLEAR":
        this.clearLines();
        break;
      case "LIST":
        this._getListFromDirectory();
        break;
      case "PRINT":
        
        if(lineContent.length > 1)
          this._getContentsOfFile(lineContent[1]);
        else {
          this.addErrorLine("Can not just simply PRINT");
        }
        break;  
      case "CD":
        if(lineContent.length > 1)
          this._parsePathRequest(lineContent[1]);
        else {
          this.addErrorLine("Can not just simply CD");
        }
        break;         
      default: break;  
    } 
  }

  render () {
    let lines = this.state.lines;
    let pathString = this.getPathString();
    console.log('pathstring is', pathString);
    return (
      <PolyWrapper>
        <PolyLines>
          {lines.map((line, index) => {
            if(line.type === "command") 
              return (<p key={index}>☭/{line.path}>&nbsp;{line.content}</p>)
            if(line.type === "error")
              return ( <p key={index}>** ERROR: &nbsp;{line.content}&nbsp;**</p>)
            if(line.type === "regular")
              return ( <p key={index}>{line.content}</p>)  
            if(line.type === "photo")
              return ( <div key={index} className="photo"><img src={"/images/" + line.content} /></div>)    
            return (<p key={index}></p>);  
          })}
        </PolyLines>
        <PolyInputWrapper>
          <span>☭/{pathString}>&nbsp;</span><PolyInput sendToParse={this.parseLine.bind(this)}/>
        </PolyInputWrapper>
      </PolyWrapper>
    )
  }

}

export default PolyStuff;