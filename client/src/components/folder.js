import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
    .binary {
        color: #e2ef13;
        text-shadow: 0 0 20px #e2ef13;
    }
`;

const FolderListing = (props) => {
    let folders = props.content.folders || [];
    let files = props.content.files || [];
    let availableFrom = props.content.availableFrom;
    if (!availableFrom) {
        availableFrom = "2018-01-12";
    }
    if(props.content.passphrase && !props.content.addedAuth) {
        props.content.addedAuth = true;
        files.push({"type": "binary", name:"auth.exe", size:"1100"})
    }
    return (
        <Table>
            <thead>
            <tr>
                <th></th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {folders.map((folder, key) => {
                console.log(folder, folders, folder.name, 'hest');
                return (
                    <tr key={key}>
                        <td>{folder.availableFrom.substring(0,9)}&nbsp;&nbsp;</td>
                        <td>&lt;dir&gt;&nbsp;&nbsp;</td>
                        <td>{folder.name}</td>
                    </tr>
                )
            })}
            {files.map((file, key) => {
                return (
                    <tr key={key} className={`${file.type === "binary" ? "binary": ""}`}>
                        <td>{availableFrom.substring(0,9)}&nbsp;&nbsp;</td>
                        <td>{file.size}&nbsp;&nbsp;</td>
                        <td className={`${file.type === "binary" ? "binary": ""}`}>{file.name}</td>
                    </tr>
                )
            })}
            <tr>
                <td colSpan="3">{folders.length} mapper</td>                
            </tr>
            <tr>
                <td colSpan="3">{files.length} filer</td>                
            </tr>
            </tbody>
        </Table>
    )
}

export default FolderListing;