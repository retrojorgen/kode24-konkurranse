import React, { Component } from "react";
import styled from "styled-components";
import AuthUser from "./authUser";
import FileSystemBrowser from "./FileSystemBrowser";

const PageWrapper = styled.div``;

class Master extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      userFolder: {},
      user: {
        email: "",
        username: ""
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
    return (
      <PageWrapper>
        {!user.email && !user.username && <AuthUser authUser={this.authUser} />}
        {user.email && user.username && <FileSystemBrowser />}
      </PageWrapper>
    );
  }
}

export default Master;
