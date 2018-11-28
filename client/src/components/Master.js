import React, { Component } from 'react';
import styled from 'styled-components';
import Input from './Input';
import { getHelp, getListFromDirectory, getContentsOfFile, submitPathCode, isVerified, createUser, authByEmail } from '../api/FileSystem';
import FolderListing from './folder';
import TxtListing from './txt';
import ChristmasTree from './tree';

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
    background: repeating-linear-gradient(#00000000,#0000003b 2px,#0000005e 2px,#00000000 4px);
    z-index:20;
  }
`;

const PolyLines = styled.div`
  `;

const PolyInputWrapper = styled.div`
`;  

class Master extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      path: [""],
      folderData: [],
    }
  }
  
  _isVerified () {
    isVerified((user) => {
      this.setState({
        user: {
          email: user.email,
          username: user.username,
          verified: true
        }
      })
    }, (error) => {
      this.setState({
        user: {
          email: "",
          username: "",
          verified: false
        }
      })
    })
  }

  componentDidMount () {
    this.setState({
      lines: [
        { type: "christmas-tree" },
        {
          type: "txt",
          content: [ 
            "║.......GOD JUL FRA.........║",
            "║..PORSGRUNNS TREDJE BESTE..║",
            "║.....INTERNETTHOSTING......║",
            "For HJÆLP SKRIV HELP",
          ]
        }
      ]
    })
    this._isVerified();
  }

  getPathString () {
    let pathString = this.state.path.join("\\");
    
    if(!pathString) pathString = "\\";
    return pathString;
  }

  addLines (newLines) {
    this.setState(
      {
        lines: [...this.state.lines, newLines]
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

  addErrorLine (errorMessage) {
    this.addLines(
      {
        type: "error",
        content: errorMessage
      }
    );
  }
  
  changePath (path) {
    getListFromDirectory(path, (response) => {
      path = path.split("\\");
      this.setState({
        path: path
      });
    }, (error) => {
      this.addErrorLine("Den derre mappa der fins ikke");
    })
  }

  

  _getContentsOfFile (file) {
    if(file.toLowerCase() === "auth.exe") {
      this.addErrorLine("Kanke printe ei binærfil. Troru er gærn jeg.");
    } else {
      getContentsOfFile(this.getPathString(), file, (response) => {
        this.addLines(response);
      }, () => {
        this.addErrorLine("Fant ikke fila jeg");
      })
    }
  }



  _getListFromDirectory () {
    getListFromDirectory(this.getPathString(), (response) => {
      response.type = "folder-list";
      this.setState(
        {
          lines: [...this.state.lines, response]
        }
      )
    })
  }




  _parsePathRequest (path) {
    if(path === "..") {
      if(this.state.path.length <= 1) {
        this.addErrorLine("Kanke gå uti der!");
      } else {
        let newPath = this.state.path.slice(0);
        newPath.pop();
        this.setState({path: newPath});
      }
    } else {
      this.changePath(this.getPathString() + path);
    }
  }


  _submitPathCode (code) {
    submitPathCode(this.getPathString(), code, (response) => {
      this.addLines(response);
    }, () => {
      this.addErrorLine("Ser ikke ut som passordet stemte gitt");
    })
  }

  validateEmail (email) {
    var re = /\S+@\S+\.\S+/;
    if(re.test(email)) {
      authByEmail(email, (user) => {
        console.log(user);
        this.addLines({
          type: "txt",
          content: [ 
              `Velkommen tilbake ${user.username}!!`,
              `Du har foreløpig ${user.points} poeng`,
            ]
          })

        this.setState({
          user: {
            email: user.email,
            username: user.username,
            verified: true
          }
        })
      }, () => {

        let user = this.state.user;
        user.email = email;
        this.setState({
          user: user
        })
        this.addLines({
          type: "txt",
          content: [ 
              `E-postadressen ${email} er godkjent!`,
            ]
          })

      })

    } else {
      this.addErrorLine("Ikke en gyldig epostadresse");
    }
  }

  validateUsername (username) {
    if(username.length > 20) {
      this.addErrorLine("Brukernavnet må være kortere enn 20 tegn");
    } else {
      let user = this.state.user;
      user.username = username;
      this.setState({
        user: user
      });
      this.addLines({
        type: "txt",
        content: [ 
          `Brukernavnet ${username} er godkjent!`,
          `Logger deg inn kompis..`,
        ]
      })
      createUser(user.email,user.username, (user) => {
        this.addLines({
            type: "txt",
            content: [`Velkommen ${username}`]
          })
        
        this.setState({
          user: {
            email: user.email,
            username: user.username,
            verified: true
          }
        });
      })
    }

  } 

  parseLine (line) {
    this.addLines({
      type: "command",
      path: this.getPathString(),
      content: line
    });

    let lineContent = line.toUpperCase().split(" ");
    if(lineContent.length > 2) {
      this.addErrorLine("Nå blei jeg litt forvirra");
      return;  
    }

    switch (lineContent[0]) {
      case "CD..":
        this._parsePathRequest("..");
        break;
      case "HELP":
        this._getHelp();
        break;
      case "CLEAR":
        this.clearLines();
        break;
      case "DIR":
        this._getListFromDirectory();
        break;
      case "AUTH":
        if(lineContent.length > 1) {
          this._submitPathCode(lineContent[1]);  
        } else {
          this.addErrorLine("Mangler kodeord");
        }
        break;
        case "AUTH.EXE":
        if(lineContent.length > 1) {
          this._submitPathCode(lineContent[1]);  
        } else {
          this.addErrorLine("Mangler kodeord");
        }
        break;        
      case "PRINT":
        if(lineContent.length > 1)
          this._getContentsOfFile(lineContent[1]);
        else {
          this.addErrorLine("Må ha noe å printe også eller?");
        }
        break;  
      case "CD":
        if(lineContent.length > 1)
          this._parsePathRequest(lineContent[1]);
        else {
          this.addErrorLine("Cd som i compact disc da eller?");
        }
        break;         
      default: 
        this.addErrorLine("Detta forstod jeg ikke");
        break;  
    } 
  }

  render () {
    let lines = this.state.lines;
    let pathString = this.getPathString();
    let user = this.state.user;
    return (
      <PolyWrapper>
        <PolyLines>
          {lines.map((line, index) => {
            if(line.type === "christmas-tree") 
              return (<ChristmasTree key={index}/>)
            if(line.type === "command") 
              return (<p key={index}>C:{line.path}>&nbsp;{line.content}</p>)
            if(line.type === "error")
              return ( <p key={index}>** ERROR: &nbsp;{line.content}&nbsp;**</p>)  
            if(line.type === "error")
              return ( <p key={index}>** ERROR: &nbsp;{line.content}&nbsp;**</p>)
            if(line.type === "regular")
              return ( <p key={index}>{line.content}</p>)
            if(line.type === "txt")
              return (<TxtListing key={index} content={line} />)
            if(line.type === "photo")
              return ( <div key={index} className="photo"><img src={line.path} alt="" /></div>)    
            if(line.type === "folder-list")
              return (<FolderListing key={index} content={line} />)  
          })}
        </PolyLines>
        <PolyInputWrapper>
          {
            (!user)
          }
          <Input
            user={user} 
            pathString={pathString} 
            sendToEmail={this.validateEmail.bind(this)}
            sendToUsername={this.validateUsername.bind(this)}
            sendToParse={this.parseLine.bind(this)} 
          />
        </PolyInputWrapper>
      </PolyWrapper>
    )
  }

}

export default Master;