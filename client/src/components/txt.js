import React, {Fragment} from 'react';
const TxtListing = (props) => {
    let name = props.content.name;
    let content = props.content.content;

    return (
        <div>
            {content.map((line, key) => {
                return (
                    <p key={key}>
                        {line}
                    </p>
                )
            })}
        </div>
    )
}

export default TxtListing;