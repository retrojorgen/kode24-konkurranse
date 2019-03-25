import React, { Component } from "react";
import styled from "styled-components";
import AuthUser from "./authUser";
import FileSystemBrowser from "./FileSystemBrowser";
import AuthFileSystemUser from "./authFileSystemUser";
import {
  ProxyFrame,
  AuthContainer,
  AuthWrapper,
  Content
} from "./styleComponents";

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
    this.logoutFileSystemUser = this.logoutFileSystemUser.bind(this);
  }

  componentDidMount() {}

  authUser(user) {
    console.log(this);
    this.setState({ user: user });
  }

  authFileSystemUser(user) {
    this.setState({ fileSystemUser: user });
    console.log(this);
  }

  logoutFileSystemUser() {
    this.setState({
      fileSystemUser: {
        username: "",
        password: ""
      }
    });
  }

  render() {
    let user = this.state.user;
    let fileSystemUser = this.state.fileSystemUser;
    console.log("hest", fileSystemUser);
    return (
      <PageWrapper>
        <AuthWrapper>
          <AuthContainer>
            <ProxyFrame />
            {!user.email && !user.username && (
              <Content className="center big-padded">
                <AuthUser authUser={this.authUser} />
              </Content>
            )}
            {user.email &&
              user.username &&
              !fileSystemUser.username &&
              !fileSystemUser.password && (
                <Content className="center big-padded dark-mode">
                  <AuthFileSystemUser
                    authFileSystemUser={this.authFileSystemUser}
                  />
                </Content>
              )}
            {user.email &&
              user.username &&
              fileSystemUser.username &&
              fileSystemUser.password && (
                <Content className="center big-padded dark-mode">
                  <FileSystemBrowser
                    user={user}
                    filesystemuser={fileSystemUser}
                    logout={this.logoutFileSystemUser}
                  />
                </Content>
              )}
          </AuthContainer>
        </AuthWrapper>
      </PageWrapper>
    );
  }
}

export default Master;
