import React from 'react';
const FolderListing = (props) => {
    console.log(props);
    let folders = props.content.folders || [];
    let files = props.content.files || [];
    let availableFrom = props.content.availableFrom;
    return (
        <table>
            <thead>
            <tr>
                <th></th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {folders.map((folder, key) => {
                return (
                    <tr key={key}>
                        <td>{folder.availableFrom}&nbsp;&nbsp;</td>
                        <td>&lt;dir&gt;&nbsp;&nbsp;</td>
                        <td>{folder.name}</td>
                    </tr>
                )
            })}
            {files.map((file, key) => {
                return (
                    <tr key={key}>
                        <td>{availableFrom}&nbsp;&nbsp;</td>
                        <td>{file.size}&nbsp;&nbsp;</td>
                        <td>{file.name}</td>
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
        </table>
    )
}

export default FolderListing;