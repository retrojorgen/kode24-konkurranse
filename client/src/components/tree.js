import React from 'react';
import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  0% {
    color: #0dff00;
    text-shadow: 0 0 20px #0eff00;
  }

  50% {
    color: #ffe400;
    text-shadow: 0 0 20px #ffe400;
  }

  0% {
    color: #0dff00;
    text-shadow: 0 0 20px #0eff00;
  }
`;

const blinkred = keyframes`
  0% {
    color: #0dff00;
    text-shadow: 0 0 20px #0eff00;
  }

  50% {
    color: #ff2a00;
    text-shadow: 0 0 20px #ff2a00;
  }

  0% {
    color: #0dff00;
    text-shadow: 0 0 20px #0eff00;
  }
`;

const blinkwhite = keyframes`
  0% {
    color: #0dff00;
    text-shadow: 0 0 20px #0eff00;
  }

  50% {
    color: #e3dec7;
    text-shadow: 0 0 20px #e3dec7;
  }

  0% {
    color: #0dff00;
    text-shadow: 0 0 20px #0eff00;
  }
`;


const Branch = styled.span`
  &:before {
    content: "*"
  }
`;

const TreeStyler = styled.div`
  text-align: center;
  max-width: 228px;
`;

const G = styled(Branch)`
    color: #0dff00;
    text-shadow: 0 0 20px #0eff00;
`;

const R = styled(Branch)`
  &:before {
    animation: ${blinkred} 1.4s 0.5s ease-in-out infinite;
  }
`;

const Y = styled(Branch)`
  &:before {
    animation: ${blink} 3s ease-in-out infinite;
  }
`;

const W = styled(Branch)`
  &:before {
    animation: ${blinkwhite} 4s 2s ease-in-out infinite;
  }
`;




const ChristmasTree = (props) => {
    return (
        <div>
          <TreeStyler>          <Y/>          </TreeStyler>
          <TreeStyler>        <G/><R/><Y/>        </TreeStyler>
          <TreeStyler>        <Y/><R/><G/><W/><G/>        </TreeStyler>
          <TreeStyler>        <G/><G/><W/><G/><R/><G/><W/><Y/>        </TreeStyler>
          <TreeStyler>        <Y/><R/><G/><W/><G/><R/><G/>        </TreeStyler>
          <TreeStyler>        <G/><G/><W/><G/><R/><G/><W/><G/><R/><Y/>        </TreeStyler>
          <TreeStyler>        <Y/><R/><G/><W/><G/><R/><G/><W/><G/><R/><G/><G/>        </TreeStyler>
          <TreeStyler>        <G/><G/><W/><G/><R/><G/><W/><G/><R/><G/><Y/>        </TreeStyler>
          <TreeStyler>        <Y/><R/><G/><W/><G/><R/><G/><W/><G/><R/><G/><W/><G/>        </TreeStyler>
          <TreeStyler>        <G/><G/><W/><G/><R/><G/><W/><G/><R/><G/><W/><G/><R/><Y/>        </TreeStyler>
          <TreeStyler>        <G/><G/><Y/><R/><G/><W/><G/><R/><G/><W/><G/><R/><G/><W/><G/><R/><G/>        </TreeStyler>
          <TreeStyler>        <G/><G/><G/><G/><G/><G/><W/><G/><R/><G/><W/><G/><R/><G/><W/><G/><R/><G/><W/><G/><Y/>        </TreeStyler>
        </div>
    )
}

export default ChristmasTree;