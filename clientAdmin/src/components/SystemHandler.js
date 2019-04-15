import React, { Component } from "react";
import styled from "styled-components";
import {
  adminHandshake,
  getAdminList,
  getCommands,
  getFileSystemUsernamePassword
} from "./socketConnection";
import { getEvents, getAnswers, getUsers } from "../api/authAPI";

const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .longlist,
  .info-container {
    margin: 20px;
    width: 100%;
    flex: 1 1 100%;
    overflow: hidden;
    h1 {
      margin: 0;
      padding: 20px;
      background: #ff67fa;
      color: black;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
  .longlist {
    position: relative;
    &:after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 400px;
      background: linear-gradient(0, #262822, transparent);
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
      commandsCount: 0,
      fileSystemUsernameAndPasswordCount: 0,
      activeUsers: 0,
      registeredUsers: 0,
      answers: {}
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

  async componentWillMount() {
    let cookie = this.getCookie("kode24Admin");
    console.log("events", cookie);
    let events = await getEvents(cookie);

    this.setState({
      commands: events.CommandEventsNewest || [],
      fileSystemUsernameAndPassword: events.UPEventsNewest || [],
      commandsCount: events.CommandEventsCount || 0,
      fileSystemUsernameAndPasswordCount: events.UPEventsCount || 0
    });
    let users = await getUsers(cookie);
    this.setState({
      registeredUsers: users.users
    });
    let answers = await getAnswers(cookie);
    this.setState({
      answers: answers
    });
  }

  componentDidMount() {
    let cookie = this.getCookie("kode24Admin");

    if (cookie) {
      adminHandshake(cookie);
    }

    getAdminList(list => {
      console.log("aktive brukere", list);
      this.setState({
        activeUsers: list
      });
    });

    getCommands(command => {
      this.setState({
        commandsCount: this.state.commandsCount + 1,
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
        fileSystemUsernameAndPasswordCount:
          this.state.fileSystemUsernameAndPasswordCount + 1,
        fileSystemUsernameAndPassword: [
          {
            data: command,
            typed: new Date()
          },
          ...this.state.fileSystemUsernameAndPassword
        ]
      });
    });
  }

  render() {
    let commands = this.state.commands;
    let passwordAttempts = this.state.fileSystemUsernameAndPassword;
    let activeUsers = this.state.activeUsers;
    let answers = this.state.answers;
    let { commandsCount, fileSystemUsernameAndPasswordCount } = this.state;
    return (
      <PageWrapper>
        <div className="longlist">
          <h1>
            Kommandoer <span className="counter">{commandsCount}</span>
          </h1>
          <ul>
            {commands.slice(0, 12).map((command, index) => (
              <li key={index}>{command.command}</li>
            ))}
          </ul>
        </div>
        <div className="longlist">
          <h1>
            Innloggingsforsøk{" "}
            <span className="counter">
              {fileSystemUsernameAndPasswordCount}
            </span>
          </h1>
          <ul>
            {passwordAttempts.slice(0, 12).map((command, index) => (
              <li key={index}>
                {command.data.username} / {command.data.password}
              </li>
            ))}
          </ul>
        </div>
        <div className="info-container">
          <h1>
            Aktive brukere<span className="counter">{activeUsers}</span>
          </h1>
          {Object.keys(answers).map((key, index) => (
            <h1 key={index}>
              {key}
              <span className="counter">{answers[key]}</span>
            </h1>
          ))}
        </div>
      </PageWrapper>
    );
  }
}

export default Master;
