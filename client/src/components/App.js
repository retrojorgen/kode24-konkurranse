import React, { Component } from "react";
import SystemHandler from "../components/SystemHandler";
import { injectGlobal } from "styled-components";

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=VT323');

  ::-webkit-scrollbar {
    width: 10px;
    background: #ff00ff;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #4f4e4e;
    border-radius: 0;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #ff00ff;
    border-radius: 0;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #f76df7;
  }

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
    color: #ff67fa;
    text-shadow: 0 0 20px #ff67fa;
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
        #0000003b 1px,
        #0000005e 1px,
        #00000000 2px
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
