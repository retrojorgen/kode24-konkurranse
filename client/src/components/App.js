import React, { Component } from 'react';
import Master from '../components/Master';
import { injectGlobal } from 'styled-components';

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
  }

  * {
    box-sizing: border-box;
  }

`

class App extends Component {
  render() {
    return (
      <Master />
    );
  }
}

export default App;
