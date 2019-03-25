import React from "react";
const TxtListing = props => {
  let content = props.filecontent;

  return (
    <div>
      {content.map((line, key) => {
        return <p key={key}>{line}</p>;
      })}
    </div>
  );
};

export default TxtListing;
