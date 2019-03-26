import React from "react";
import styled, { keyframes } from "styled-components";

const flicker = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const LoadingFlickerStyle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: calc(100% + 40px);
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  transform: translateY(0);
  div {
    width: 100%;
    height: 100%;
  }
  .p {
    background: purple;
  }
  .y {
    background: yellow;
  }
  .g {
    background: green;
  }
  .b {
    background: blue;
  }
  animation: ${flicker} 0.5s ${props => props.delay}s linear infinite;
  &.purple {
      .p {
          background: #c617db;
      }
      .y {
          background: #a12baf;
      }
      .g {
          background: #8b0be5;
      }
      .b {
          background: #ff10a8;
      }
  }
`;

const LoadingBackground = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: black;
`;

const LoadingFlicker = (props) => (
  <>
    <LoadingBackground />
    <LoadingFlickerStyle delay="0" className={props}>
      <div className="p" />
      <div className="y" />
      <div className="g" />
      <div className="b" />
      <div className="p" />
      <div className="y" />
      <div className="g" />
      <div className="b" />
      <div className="p" />
      <div className="y" />
      <div className="g" />
      <div className="b" />
    </LoadingFlickerStyle>
    <LoadingFlickerStyle delay="0.25" className={props}>
      <div className="g" />
      <div className="y" />
      <div className="b" />
      <div className="y" />
      <div className="g" />
      <div className="b" />
      <div className="y" />
      <div className="p" />
      <div className="b" />
      <div className="p" />
      <div className="y" />
      <div className="g" />
    </LoadingFlickerStyle>
    <LoadingFlickerStyle delay="0.125" className={props}>
      <div className="p" />
      <div className="g" />
      <div className="y" />
      <div className="p" />
      <div className="y" />
      <div className="p" />
      <div className="g" />
      <div className="b" />
      <div className="y" />
      <div className="b" />
      <div className="g" />
      <div className="p" />
    </LoadingFlickerStyle>
    <LoadingFlickerStyle delay="0.425">
      <div className="g" />
      <div className="p" />
      <div className="b" />
      <div className="y" />
      <div className="b" />
      <div className="g" />
      <div className="y" />
      <div className="p" />
      <div className="b" />
      <div className="g" />
      <div className="y" />
      <div className="b" />
    </LoadingFlickerStyle>        
  </>
);

export default LoadingFlicker;
