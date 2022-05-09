import React from 'react';

const UploadFileButton = ({importImageFile}) => {

    return (
        <div>
            <form className="uploadButton">
                <label>
                    <input type={"file"} name={"addFile"}
                           accept="image/jpeg, image/png, image/jpg"
                           onChange={importImageFile}/>
                    Import image
                </label>
            </form>
        </div>
    )
}

export default UploadFileButton
