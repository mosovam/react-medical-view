import React from 'react';
import CornerstoneViewport from 'react-cornerstone-viewport'
import {cornerstoneCustomTools, dicomImagesFromWeb} from "../cornerstone.config";

interface CornerstoneViewProps {
    imagesIds: string[]
}

const CornerstoneView = ({imagesIds}: CornerstoneViewProps) => {

    // load dicom images from web if there is no image selected by user
    if (!imagesIds || imagesIds.length === 0) {
        imagesIds = dicomImagesFromWeb;
    }

    return (
        <CornerstoneViewport
            tools={cornerstoneCustomTools}
            imageIds={imagesIds}
            style={{minWidth: '100%', height: '512px', flex: '1'}}
        />
    )
}

export default CornerstoneView;
