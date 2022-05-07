import React from 'react';
import CornerstoneViewport from 'react-cornerstone-viewport'
import {cornerstoneCustomTools, dicomImagesFromWeb} from "../cornerstone.config";
import {diffButtonEnum} from "../../components/MainApp";
import About from "../../components/About";

interface CornerstoneViewProps {
    imagesIds: string[];
    pageType: string;
}

const View = ({imagesIds, pageType}: CornerstoneViewProps) => {

    // load dicom images from web if there is no image selected by user
    if (!imagesIds || imagesIds.length === 0) {
        imagesIds = dicomImagesFromWeb;
    }


    if (pageType === diffButtonEnum.ABOUT) {
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
