import React, {useState} from 'react'
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import {arrayBufferToImage, createImage} from "../cornerstone/jpeg-loader";
import {cloneDeep} from 'lodash';
import {initCornerstone} from "../cornerstone/basic-settings";
import CornerstoneViewport from "../cornerstone/components/Cornerstone-View";
import {getPredictions} from "../neural-network/predictions";

const MainApp = () => {
    const [imagesIds, setImagesIds] = useState<string[]>([]);
    const [jpegFiles, setJpegFiles] = useState<{ [key: string]: File }>({});

    const jpegFIlePrefix = 'jpegfile';
    const dicomFilePrefix = 'dicomfile';
    // let jpegFiles: { [key: string]: File } = {};

    // init cornerstone tools in app
    const cornerstone = initCornerstone();

    const loadTheFile = (imageId: string) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = (e) => {
                if (e?.target?.result) {
                    const imagePromise = arrayBufferToImage(e.target.result as ArrayBuffer);
                    imagePromise.then((image) => {
                        const imageObject = createImage(image, imageId, cornerstone);
                        resolve(imageObject);
                    }, reject);
                } else {
                    throw Error();
                }
            };

            fileReader.onerror = reject;
            fileReader.readAsArrayBuffer(jpegFiles[imageId]);
        });

        return {
            promise
        };
    }

    const handleChange = (event) => {
        const imageIds = cloneDeep(cacheFilesAndGetImageIds(event.target.files as FileList));

        // register the images to the cornerstone - they will have the 'dicomfile:' or 'jpegfile' prefix
        cornerstone.registerImageLoader(dicomFilePrefix, cornerstoneWADOImageLoader.loadImage);
        cornerstone.registerImageLoader(jpegFIlePrefix, loadTheFile)
        setImagesIds(imageIds);
    }

    const cacheFilesAndGetImageIds = (files: FileList): string[] => {
        const imageIds = [];
        cornerstone.imageCache.purgeCache();

        // TODO - někde tady je problém s načítáním file, kdy to při vybrání tří snímků načte 1 a 2 snímek jako stejné snímky
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.type.includes('dicom')) {
                imageIds.push(cornerstoneWADOImageLoader.wadouri.fileManager.add(file))
            } else if (file.type.includes('jpeg')) {
                const imageId: string = `${jpegFIlePrefix}:${(Math.round(Math.random() * 10000000))}`;

                // store the file
                jpegFiles[imageId] = file;
                imageIds.push(imageId);
            }
        }

        return imageIds;
    }

    const getTumorMask = async () => {
        console.log('jpegFiles', jpegFiles);
        // const tumorMaskImg = await getPredictions(jpegFiles[imagesIds[0]]);
        const tumorMaskImg = await getPredictions('https://drive.google.com/uc?export=download&id=1dcBM4vewLXDqpigOJHOHEVBysPwbJ1fl');
        console.log('tumorMaskImg', tumorMaskImg);
    }

    return (
        <div>
            <h2>Cornerstone React Component Example</h2>
            <input type={"file"} name={"file"} style={{padding: 5, margin: 10}} onChange={handleChange}/>
            <button type={"button"} name={"getTumorMask"} style={{padding: 5, margin: 10}} onClick={getTumorMask}>Get
                tumor mask
            </button>
            <CornerstoneViewport imagesIds={imagesIds}/>
        </div>
    )
}

export default MainApp
