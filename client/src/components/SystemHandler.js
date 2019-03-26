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
import LoadingFlicker from "./loadingFlicker";

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
      },
      loading: false,
    };

    this.authUser = this.authUser.bind(this);
    this.authFileSystemUser = this.authFileSystemUser.bind(this);
    this.logoutFileSystemUser = this.logoutFileSystemUser.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
  }

  componentDidMount() {}

  authUser(user) {
    this.setState({ user: user });
  }

  authFileSystemUser(user) {
    this.setState({ fileSystemUser: user });
  }

  logoutFileSystemUser() {
    this.setState({
      fileSystemUser: {
        username: "",
        password: ""
      }
    });
  }

  toggleLoading(toggle) {
    this.setState({loading: toggle});
  }

  render() {
    let user = this.state.user;
    let fileSystemUser = this.state.fileSystemUser;
    let loading = this.state.loading;
    return (
      <PageWrapper>
        <AuthWrapper>
          <AuthContainer>
            <ProxyFrame />
            {!user.email && !user.username && (
              <Content className="center big-padded">
                <AuthUser authUser={this.authUser} loading={this.toggleLoading}/>
              </Content>
            )}
            
            {user.email &&
              user.username &&
              !fileSystemUser.username &&
              !fileSystemUser.password && (
                <Content className="center big-padded dark-mode">
                  <AuthFileSystemUser
                    authFileSystemUser={this.authFileSystemUser}
                    loading={this.toggleLoading}
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
                    loading={this.toggleLoading}
                  />
                </Content>
              )}
              <div style={{opacity: loading ? "1": "0", "pointer-events": "none", "position": loading ? "absolute": "fixed", "left": 0, "top": 0, "width": "100%", "height": "100%"}}>
                <LoadingFlicker ></LoadingFlicker>
              </div>
          </AuthContainer>
        </AuthWrapper>
      </PageWrapper>
    );
  }
}

export default Master;
