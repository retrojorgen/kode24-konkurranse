import React, { Component } from "react";
import styled from "styled-components";
import {
  adminHandshake,
  getAdminList,
  getCommands,
  getFileSystemUsernamePassword,
  getEvents
} from "./socketConnection";

const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  .longlist,
  .info-container {
    border: 2px solid #ff67fa;
    margin: 20px;
    width: 100%;
    flex: 1 1 100%;
    h1 {
      margin: 0;
      padding: 20px;
      background: #ff67fa;
      color: black;
      text-transform: uppercase;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        padding: 10px;
        font-size: 32px;
      }
    }
  }
  .info-container {
    h2 {
      text-align: center;
      margin: 0;
      padding: 20px;
      font-size: 60px;
    }
  }
`;

class Master extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commands: [],
      fileSystemUsernameAndPassword: [],
      activeUsers: 0
    };
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  componentDidMount() {
    let cookie = this.getCookie("kode24Admin");
    console.log("fant kake", cookie);
    if (cookie) {
      adminHandshake(cookie);
    }

    getAdminList(list => {
      this.setState({
        activeUsers: list
      });
    });

    getCommands(command => {
      this.setState({
        commands: [
          {
            command: command,
            typed: new Date()
          },
          ...this.state.commands
        ]
      });
    });

    getFileSystemUsernamePassword(command => {
      this.setState({
        fileSystemUsernameAndPassword: [
          {
            data: command,
            typed: new Date()
          },
          ...this.state.fileSystemUsernameAndPassword
        ]
      });
    });

    getEvents(events => {
      let newState = Object.assign({}, this.state);

      events.forEach(event => {
        if (event.type === "typed command") {
          newState.commands.push({
            command: event.command,
            typed: event.added
          });
        }
        if (event.type === "typed filesystem username password") {
          newState.fileSystemUsernameAndPassword.push({
            data: event.data,
            typed: event.added
          });
        }
      });
      newState.commands = newState.commands.reverse();
      newState.fileSystemUsernameAndPassword = newState.fileSystemUsernameAndPassword.reverse();
      this.setState(newState);
    });
  }

  render() {
    let commands = this.state.commands;
    let passwordAttempts = this.state.fileSystemUsernameAndPassword;
    let activeUsers = this.state.activeUsers;
    return (
      <PageWrapper>
        <div className="longlist">
          <h1>Kommandoer</h1>
          <ul>
            {commands.map((command, index) => (
              <li key={index}>{command.command}</li>
            ))}
          </ul>
        </div>
        <div className="longlist">
          <h1>Innloggingsforsøk</h1>
          <ul>
            {passwordAttempts.map((command, index) => (
              <li key={index}>
                {command.data.username} / {command.data.password}
              </li>
            ))}
          </ul>
        </div>
        <div className="info-container">
          <h1>Aktive brukere</h1>
          <h2>{activeUsers}</h2>
        </div>
      </PageWrapper>
    );
  }
}

export default Master;
