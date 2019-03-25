import React, { Component } from "react";
import SystemHandler from "../components/SystemHandler";
import { injectGlobal } from "styled-components";

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=VT323');

  html {
    height: 100%;
    width: 100%;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: 'VT323', monospace;
    height: 100%;
    width: 100%;
    color: #0dff00;
    text-shadow: 0 0 20px #1d6119;
    background-color: #262822;
    display: flex;
    align-items: center;
    justify-content: center;
    &:after {
      content: "";
      pointer-events: none;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        #00000000,
        #0000003b 2px,
        #0000005e 2px,
        #00000000 4px
      );
      z-index: 20;
    }
  }

  * {
    box-sizing: border-box;
  }

`;

class App extends Component {
  render() {
    return <SystemHandler />;
  }
}

export default App;
