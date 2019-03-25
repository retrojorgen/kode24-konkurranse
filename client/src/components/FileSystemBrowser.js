import React, { Component } from "react";
import styled from "styled-components";
import Input from "./Input";
import { getHelp, getFiles, submitCode } from "../api/FileSystem";
import FolderListing from "./folder";
import TxtListing from "./txt";
import ChristmasTree from "./tree";

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
  text-shadow: 0 0 20px #0eff00;
  overflow: hidden;
  text-transform: uppercase;
  @media (min-width: 1025px) {
    padding: 40px;
  }
  .photo {
    .little {
      width: 50px;
    }
    img {
      max-width: 320px;
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
    background: repeating-linear-gradient(
      #00000000,
      #0000003b 2px,
      #0000005e 2px,
      #00000000 4px
    );
    z-index: 20;
  }
`;

const PolyLines = styled.div``;

const PolyInputWrapper = styled.div``;

class Master extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      userFolder: {},
      user: {},
      hasAnswered: false,
      files: []
    };
  }

  componentDidMount() {
    this.setState({
      lines: [
        { type: "christmas-tree" },
        {
          type: "txt",
          content: [
            "║.......GOD JUL FRA.........║",
            "║..PORSGRUNNS TREDJE BESTE..║",
            "║.....INTERNETTHOSTING......║",
            "║......TOMSHOSTING.NO.......║",
            "FOR HJÆLP SKRIV HELP"
          ]
        }
      ]
    });
  }

  addLines(newLines) {
    this.setState({
      lines: [...this.state.lines, newLines]
    });
  }

  clearLines() {
    this.setState({
      lines: []
    });
  }

  _getHelp() {
    getHelp(response => {
      this.addLines(response);
    });
  }

  addErrorLine(errorMessage) {
    this.addLines({
      type: "error",
      content: errorMessage
    });
  }

  async componentDidMount() {
    let folderInfo = await getFiles();
    console.log("got files", folderInfo);

    if (folderInfo.files.length) {
      this.setState({ files: folderInfo.files });
      this.addLines({ type: "files", content: folderInfo.files });
    }
  }

  _getContentsOfFile(fileName) {
    fileName = fileName.toLowerCase();
    let files = this.state.files.filter(file => file.name === fileName);
    console.log(fileName, this.state.files);
    if (files.length) {
      console.log("fant fila", files);
      this.addLines({ type: "txt", content: files[0].content });
    }
  }

  _getListFromDirectory() {
    this.addLines({ type: "files", content: this.state.files });
  }

  _submitPathCode(code) {
    // used to lock user directory
  }

  parseLine(line) {
    this.addLines({
      type: "command",
      content: line
    });

    let lineContent = line.toUpperCase().split(" ");
    if (lineContent.length > 2) {
      this.addErrorLine("Nå blei jeg litt forvirra");
      return;
    }

    switch (lineContent[0]) {
      case "HELP":
        this._getHelp();
        break;
      case "CLEAR":
        this.clearLines();
        break;
      case "DIR":
        this._getListFromDirectory();
        break;
      case "AUTH.EXE":
        if (lineContent.length > 1) {
          this._submitPathCode(lineContent[1]);
        } else {
          this.addErrorLine("Mangler kodeord");
        }
        break;
      case "LOGOUT":
        console.log("hest");
        this.props.logout();
        break;
      case "PRINT":
        console.log("hest2");
        if (lineContent.length > 1) this._getContentsOfFile(lineContent[1]);
        else {
          this.addErrorLine("Må ha noe å printe også eller?");
        }
        break;
      default:
        this.addErrorLine("Detta forstod jeg ikke");
        break;
    }
  }

  render() {
    let lines = this.state.lines;
    let user = this.props.user;
    let fileSystemUser = this.props.filesystemuser;
    return (
      <PolyWrapper>
        <PolyLines>
          {lines.map((line, index) => {
            if (line.type === "christmas-tree")
              return <ChristmasTree key={index} />;
            if (line.type === "command")
              return (
                <p key={index}>
                  C:{line.path}>&nbsp;{line.content}
                </p>
              );
            if (line.type === "error")
              return <p key={index}>** ERROR: &nbsp;{line.content}&nbsp;**</p>;
            if (line.type === "regular")
              return <p key={index}>{line.content}</p>;
            if (line.type === "txt")
              return <TxtListing key={index} filecontent={line.content} />;
            if (line.type === "photo")
              return (
                <div key={index} className="photo">
                  <img src={line.path} alt="" />
                </div>
              );
            if (line.type === "files")
              return <FolderListing key={index} files={line.content} />;
            return <p />;
          })}
        </PolyLines>
        <PolyInputWrapper>
          {!user}
          <Input
            user={user}
            pathString={fileSystemUser.username}
            sendToParse={this.parseLine.bind(this)}
          />
        </PolyInputWrapper>
      </PolyWrapper>
    );
  }
}

export default Master;
