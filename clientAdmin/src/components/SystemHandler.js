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
    if (cookie) {
      adminHandshake(cookie);
    }

    getAdminList(list => {
      console.log(list);
      this.setState({
        activeUsers: list
      });
    });

    getCommands(command => {
      this.setState({
        commands: [
          ...this.state.commands,
          {
            command: command,
            typed: new Date()
          }
        ]
      });
    });

    getFileSystemUsernamePassword(command => {
      console.log(command);
      this.setState({
        fileSystemUsernameAndPassword: [
          ...this.state.fileSystemUsernameAndPassword,
          {
            data: command,
            typed: new Date()
          }
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
      this.setState(newState);
    });

    console.log(cookie);
  }

  render() {
    let commands = this.state.commands.reverse();
    let passwordAttempts = this.state.fileSystemUsernameAndPassword.reverse();
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
