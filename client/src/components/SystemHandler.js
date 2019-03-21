import React, { Component } from "react";
import styled from "styled-components";
import AuthUser from "./authUser";
import FileSystemBrowser from "./FileSystemBrowser";

class Master extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      userFolder: {},
      user: {
        email: "",
        username: "",
        verified: false
      },
      fileSystemUser: {}
    };
  }

  componentDidMount() {}

  authUser(user) {
    console.log("fikk bruker", user);
  }

  render() {
    let user = this.state.user;
    if (user.verified) {
      return <FileSystemBrowser />;
    } else {
      return <AuthUser authUser={this.authUser} />;
    }
  }
}

export default Master;
