import React, {useState} from 'react'
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import {
    arrayBufferToImage,
    createImage
} from "../cornerstone/image-loader";
import {cloneDeep} from 'lodash';
import {initCornerstone} from "../cornerstone/basic-settings";
import CornerstoneViewport from "../cornerstone/components/Cornerstone-View";
import {getPredictions} from "../neural-network/predictions";
import {FilePrefixEnum} from "../models/file-prefix.enum";
import {tensorToImageData} from "../cornerstone/tensor-loader";
import {Tensor} from "onnxruntime-web";

const MainApp = () => {
    // IDs used for cornerstone images viewer
    const [imagesIds, setImagesIds] = useState<string[]>([]);

    // TODO: create some store instead of this?
    const [jpegFiles, setJpegFiles] = useState<{ [key: string]: File }>({});
    const [nnImages, setNnImages] = useState<{ [key: string]: any }>({});

    /**
     * Import JPEG or DICOM image selected by user and show it in cornerstone view component
     * @param event - event carrying the image file
     */
    const importJPEGorDICOMFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
        clearCornerstoneCache();

        const imageIds = cloneDeep(cacheFilesAndGetImageIds(event.target.files as FileList));
        // set images and automatically trigger the image change in cornerstone view component
        setImagesIds([...imagesIds, ...imageIds]);
    }

    /**
     * Load image imported by user into app into cornerstone view component
     *  - this loader is automatically selected by cornerstone thanks to the 'imageID' prefix = 'jpegfile'
     *  - return promise in object, because of cornerstone
     * @param imageId - image id with 'jpegfile' prefix
     */
    const loadJPEG = (imageId: string): { promise: Promise<any> } => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            // load the file and create image from it
            fileReader.onload = (e: ProgressEvent<FileReader>) => {
                if (e?.target?.result) {

                    // convert buffer to image that can be used in cornerstone view component
                    const imagePromise = arrayBufferToImage(e.target.result as ArrayBuffer);

                    imagePromise.then((image) => {
                        const imageObject = createImage(image, imageId, cornerstone);
                        resolve(imageObject);
                    }, reject);
                } else {
                    throw Error();
                }
            };

            // read the loaded file
            fileReader.onerror = reject;
            fileReader.readAsArrayBuffer(jpegFiles[imageId]);
        }).catch((e) => {
            console.log('Error while loading the JPEG file: ', e);
        })

        return {
            promise
        }
    }

    /**
     * Load image returned by Neural network into cornerstone view component
     *  - this loader is selected by cornerstone thanks to the 'imageId' prefix = 'nnfile'
     *  - return promise in object, because of cornerstone
     * @param imageId - image id with 'nnfile' prefix
     */
    const loadNNImage = (imageId: string): { promise: Promise<any> } => {
        const promise = new Promise((resolve, reject) => {

            // convert vector returned by the neural network to image data
            const img = tensorToImageData(nnImages[imageId]);
            // convert buffer to image that can be used in cornerstone view component
            const imagePromise = arrayBufferToImage(img.data);

            imagePromise.then((image) => {
                const imageObject = createImage(image, imageId, cornerstone);
                resolve(imageObject);
            }, reject).catch((e) => {
                console.log('Error while creating image returned by Neural Network: ', e);
            })
        }).catch((e) => {
            console.log('Error while loading image returned by Neural Network: ', e);
        });

        return {
            promise
        }
    }


    /**
     * Cache JPEG or DICOM file imported by user and actualize 'imagesIds' array to trigger change image in cornerstone view component
     * @param files - all imported JPEG or DICOM images
     */
    const cacheFilesAndGetImageIds = (files: FileList): string[] => {
        const importedIds = [];

        // TODO - někde tady je problém s načítáním file, kdy to při vybrání tří snímků načte 1 a 2 snímek jako stejné snímky
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.type.includes('dicom')) {
                // DICOM image has it's own loader in cornerstone
                importedIds.push(cornerstoneWADOImageLoader.wadouri.fileManager.add(file))
            } else if (file.type.includes('jpeg')) {
                // for JPEG image, there is custom loader needed, so store only the id
                const importedFileId: string = `${FilePrefixEnum.JPEG}:${(Math.round(Math.random() * 10000000))}`;

                // store the file with imageId as object key
                setJpegFiles(images => ({
                    ...images,
                    [importedFileId]: file
                }));

                importedIds.push(importedFileId);
            }
        }

        return importedIds;
    }

    /**
     * Pass the image to the neural network and show the result image in cornerstone view component
     **/
    const getTumorMask = async () => {
        // TODO: here pass the actual image shown in cornerstone view
        await getPredictions('https://drive.google.com/uc?export=download&id=1dcBM4vewLXDqpigOJHOHEVBysPwbJ1fl')
        // await getPredictions('https://drive.google.com/uc?export=download&id=1fEP8VoAx3ok_L31DEVIgpW9TSHsWtXvd')
            .then((mask: Tensor) => {
                console.log('Neural network prediction COMPLETED!');
                clearCornerstoneCache();

                // create NN image id
                const maskImageId: string = `${FilePrefixEnum.NN}:${(Math.round(Math.random() * 10000000))}`;
                // store the mask with nnImageId as object key
                setNnImages(images => ({
                    ...images,
                    [maskImageId]: mask
                }));

                // set images and automatically trigger the image change in cornerstone view component
                setImagesIds([...imagesIds, maskImageId]);

                return mask;
            }).catch((e) => {
                console.log('Error while getting prediction mask in Neural network: ', e);
            })

    }

    // init cornerstone tools in app
    const cornerstone = initCornerstone();
    const clearCornerstoneCache = (): void => {
        cornerstone.imageCache.purgeCache();
    }

    // register the images to the cornerstone
    // DICOM images are loaded automatically, for 'JPEG' and mask from neural network there is the custom loader needed
    cornerstone.registerImageLoader(FilePrefixEnum.DICOM, cornerstoneWADOImageLoader.loadImage);
    cornerstone.registerImageLoader(FilePrefixEnum.JPEG, loadJPEG)
    cornerstone.registerImageLoader(FilePrefixEnum.NN, loadNNImage)


    return (
        <div>
            <h2>Cornerstone React Component Example</h2>
            <input type={"file"} name={"addFile"} accept="image/jpeg, */dicom,.dcm, image/dcm, */dcm, .dicom"
                   style={{padding: 5, margin: 10}}
                   onChange={importJPEGorDICOMFile}/>
            <button type={"button"} name={"getTumorMask"} style={{padding: 5, margin: 10}} onClick={getTumorMask}>Get
                tumor mask
            </button>
            <CornerstoneViewport imagesIds={imagesIds}/>
        </div>
    )
}

export default MainApp
