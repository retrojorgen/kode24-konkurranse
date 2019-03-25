import React from "react";
import styled from "styled-components";

const Table = styled.table`
  .binary {
    color: #e2ef13;
    text-shadow: 0 0 20px #e2ef13;
  }
`;

const FolderListing = props => {
  let files = props.files || [];

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
              <td>{file.size}&nbsp;&nbsp;</td>
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
