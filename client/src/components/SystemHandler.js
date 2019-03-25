import React, { Component } from "react";
import styled from "styled-components";
import AuthUser from "./authUser";
import FileSystemBrowser from "./FileSystemBrowser";
import AuthFileSystemUser from "./authFileSystemUser";

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
      fileSystemUser: {
        username: "",
        password: ""
      }
    };

    this.authUser = this.authUser.bind(this);
    this.authFileSystemUser = this.authFileSystemUser.bind(this);
  }

  componentDidMount() {}

  authUser(user) {
    console.log(this);
    this.setState({ user: user });
  }

  authFileSystemUser(user) {
    this.setState({ fileSystemUser: user });
  }

  render() {
    let user = this.state.user;
    let fileSystemUser = this.state.fileSystemUser;
    return (
      <PageWrapper>
        {!user.email && !user.username && <AuthUser authUser={this.authUser} />}
        {user.email &&
          user.username &&
          !fileSystemUser.username &&
          !fileSystemUser.password && (
            <AuthFileSystemUser authFileSystemUser={this.authFileSystemUser} />
          )}
        {user.email &&
          user.username &&
          fileSystemUser.username &&
          fileSystemUser.password && (
            <FileSystemBrowser user={user} filesystemuser={fileSystemUser} />
          )}
      </PageWrapper>
    );
  }
}

export default Master;
