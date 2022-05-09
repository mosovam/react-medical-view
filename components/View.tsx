import React from 'react';
import CornerstoneViewport from 'react-cornerstone-viewport'
import {cornerstoneCustomTools, dicomImagesFromWeb} from "../cornerstone/cornerstone.config";
import About from "./About";
import {DiffButtonEnum} from "../models/diff-button.enum";

interface ViewProps {
    imagesIds: string[];
    pageType: string;
}

const View = ({imagesIds, pageType}: ViewProps) => {

    if (pageType === DiffButtonEnum.ABOUT) {
        // load dicom images from web if there is no image selected by user
        if (!imagesIds || imagesIds.length === 0) {
            // imagesIds = dicomImagesFromWeb;
        }

        console.log('imagesIds', imagesIds);

        return (
            <CornerstoneViewport
                tools={cornerstoneCustomTools}
                imageIds={imagesIds}
                style={{maxWidth: '100%', maxHeight: '100%'}}
            />
        )
    } else {
        return (
            <About/>
        )
    }

}

export default View;
