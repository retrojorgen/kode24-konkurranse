import styled from "styled-components";

const AuthWrapper = styled.div`
  background: #a100ff;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  position: absolute;
  left: 14px;
  top: 14px;
  width: calc(100% - 28px);
  height: calc(100% - 28px);
  &.center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  &.big-padded {
    padding: 40px;
  }
  &.dark-mode {
    background-color: black;
  }

  h1 {
    color: white;
    text-transform: lowercase;
    font-size: 100px;
    text-shadow: 4px 4px 0px black;
    margin: 0;
  }
  h2 {
    color: black;
    text-shadow: none;
  }
  form {
    width: 100%;
  }

  input {
    border: 4px solid black;
    width: 100%;
    display: block;
    color: black;
    font-size: 20px;
    padding: 20px 10px;
    margin-bottom: 20px;
    text-align: center;
    text-transform: uppercase;
    font-family: "VT323", monospace;
    &::placeholder {
      font-family: "VT323", monospace;
    }
  }
`;

const ProxyFrame = styled.div`
  &:before {
    content: "";
    pointer-events: none;
    position: absolute;
    left: 10px;
    top: 10px;
    width: calc(100% - 28px);
    height: calc(100% - 28px);
    border: 4px solid black;
    z-index: 10;
  }
  &:after {
    content: "Accenture proxy";
    pointer-events: none;
    position: absolute;
    left: 50%;
    top: 5px;
    text-transform: uppercase;
    color: white;
    background-color: black;
    padding: 4px;
    width: auto;
    height: auto;
    transform: translateX(-40px);
    z-index: 10;
  }
`;
const AuthContainer = styled.div`
  color: #a100ff;
  text-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-transform: uppercase;

  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 800px;
  max-height: 600px;
  background: #d2d2d2;
  box-shadow: 20px 26px 0px black;
  padding: 40px;
  position: relative;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: space-between;
  justify-content: center;

  button {
    background: transparent;
    text-transform: uppercase;
    color: white;
    font-family: "VT323", monospace;
    font-size: 20px;
    border: 0;
    width: auto;
    margin-bottom: 20px;
    position: relative;
    height: 60px;
    min-width: 200px;
    margin: 10px;
    &:disabled {
      color: rgba(255, 255, 255, 0.4);
    }
    &:hover {
      span {
        transform: translateX(-2px) translateY(-2px);
        transition: all 100ms ease-in-out;
      }
    }
    cursor: pointer;
    span {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: black;
      transition: all 100ms ease-in-out;
    }
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #a7a7a7;
      transform: translateX(6px) translateY(6px);
    }
  }
`;

export { ProxyFrame, AuthWrapper, AuthContainer, ButtonWrapper, Content };
