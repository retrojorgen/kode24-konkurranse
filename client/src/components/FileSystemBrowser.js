import React, { Component } from "react";
import styled from "styled-components";
import Input from "./Input";
import { getHelp, getFiles, trollFiles } from "../api/FileSystem";
import FolderListing from "./folder";
import TxtListing from "./txt";
import { submitCommand } from "./socketConnection";

const PolyWrapper = styled.div`
  color: #ff67fa;
  padding: 20px;
  font-size: 20px;
  text-shadow: 0 0 20px #ff67fa;
  overflow: auto;
  text-transform: uppercase;
  text-align: left;
  background-color: black;
  max-height: 600px;
  pre {
    font-family: inherit;
  }
  input {
    text-align: center;
  }

  @media (min-width: 1000px) {
    width: 800px;
    height: 600px;
  }
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
`;

const PolyLines = styled.div`
  .regular {
    text-transform: none;
  }
`;

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

    this.bottomRef = React.createRef();
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

  async doTroll() {
    if (this.state.hasAnswered) {
      this.addErrorLine("Du har trolla denne kontoen grundig allerede du!");
    } else {
      let hasTrolled = await trollFiles();
      console.log(hasTrolled);
      this.setState({ hasAnswered: true });
      this.addLines({
        type: "giphy",
        content:
          "https://media3.giphy.com/media/l4KhYOegtiwcmNpdu/giphy.gif?cid=3640f6095c99dd047330784d77107c80"
      });
      this.addLines({
        type: "ascii",
        content: `
     ...SHIT! TROLLA!! ....
    `
      });
    }
  }

  async _getHelp() {
    let helpResponse = await getHelp();
    if (helpResponse) {
      this.addLines(helpResponse);
    }
  }

  addErrorLine(errorMessage) {
    this.addLines({
      type: "error",
      content: errorMessage
    });
  }

  async componentDidMount() {
    console.log("component did mount", "getting files for user");
    this.setState({
      lines: [
        {
          type: "ascii",

          content: `
             _ _.-''-._ _
            ;.'________'.;
 _________n.[____________].n_________
|""_""_""_""||==||==||==||""_""_""_""]
|"""""""""""||..||..||..||"""""""""""|
|LI LI LI LI||LI||LI||LI||LI LI LI LI|
|.. .. .. ..||..||..||..||.. .. .. ..|
|LI LI LI LI||LI||LI||LI||LI LI LI LI|
;;,;;;,;;;,;;;,;;;,;;;,;;;,;;,;;;,;;;;

----= PORSGRUN RÅDHUS FILSERVER =-----
[Logget inn som: ${this.props.filesystemuser.username}]
            `
        }
      ]
    });

    let folderInfo = await getFiles();
    console.log("got files", folderInfo);

    if (folderInfo && folderInfo.files.length) {
      this.setState({ files: folderInfo.files });
      if (folderInfo.hasAnswered) {
        this.setState({ hasAnswered: true });
      }
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

  scrollToBottom = () => {
    this.bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  parseLine(line) {
    console.log(line, this.state.user);
    submitCommand(line);
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
      case "TROLL":
        this.doTroll();
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
        console.log("logger ut");
        this.setState({ user: {} });
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
    let hasAnswered = this.state.hasAnswered;
    return (
      <PolyWrapper>
        <PolyLines>
          {lines.map((line, index) => {
            if (line.type === "ascii")
              return <pre key={index}>{line.content}</pre>;
            if (line.type === "giphy")
              return (
                <div>
                  <img height="140" alt="gif" src={line.content} />
                </div>
              );
            if (line.type === "command")
              return (
                <p key={index}>
                  {hasAnswered && <>💀</>}~{fileSystemUser.username}$&nbsp;
                  {line.content}
                </p>
              );
            if (line.type === "error")
              return <p key={index}>** ERROR: &nbsp;{line.content}&nbsp;**</p>;
            if (line.type === "regular")
              return (
                <p key={index} className="regular">
                  {line.content}
                </p>
              );
            if (line.type === "txt")
              return <TxtListing key={index} filecontent={line.content} />;
            if (line.type === "photo")
              return (
                <div key={index} className="photo">
                  <img src={line.path} alt="" />
                </div>
              );
            if (line.type === "files")
              return (
                <FolderListing
                  key={index}
                  files={line.content}
                  hasAnswered={hasAnswered}
                />
              );
            return <p />;
          })}
        </PolyLines>
        <PolyInputWrapper innerRef={this.bottomRef}>
          {!user}
          <Input
            user={user}
            pathString={fileSystemUser.username}
            sendToParse={this.parseLine.bind(this)}
            hasAnswered={hasAnswered}
          />
        </PolyInputWrapper>
      </PolyWrapper>
    );
  }
}

export default Master;
