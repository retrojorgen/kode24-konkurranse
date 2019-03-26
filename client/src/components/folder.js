import React from "react";
import styled from "styled-components";

const Table = styled.table`
  .binary {
    color: #e2ef13;
    text-shadow: 0 0 20px #e2ef13;
  }
  margin-top: 10px;
  margin-bottom: 10px;
  tr {
    display: flex;
    align-items: center;
  }
`;

const FolderListing = props => {
  let files = props.files || [];
  let hasAnswered = props.hasAnswered;
  return (
    <Table>
      <thead>
        <tr>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {files.map((file, key) => {
          return (
            <tr key={key}>
              <td>
                {hasAnswered && <>💀</>}
                {file.size}&nbsp;&nbsp;
              </td>
              <td>{file.name}</td>
            </tr>
          );
        })}
        <tr>
          <td colSpan="3">{files.length} filer</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default FolderListing;
