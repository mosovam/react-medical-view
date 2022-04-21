import React from 'react';
import CornerstoneViewport from 'react-cornerstone-viewport'
import {cornerstoneCustomTools, dicomImagesFromWeb} from "../cornerstone.config";
import initCornerstone from "../basic-settings";

// init cornerstone tools in app
initCornerstone()


const CornerstoneView = () => {
    return (
        <CornerstoneViewport
            tools={cornerstoneCustomTools}
            imageIds={dicomImagesFromWeb}
            style={{minWidth: '100%', height: '512px', flex: '1'}}
        />
    )
}

export default CornerstoneView;
