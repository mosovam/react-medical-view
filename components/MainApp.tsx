import React, {useState} from 'react';
import {cloneDeep} from 'lodash';
import {initCornerstone} from "../cornerstone/basic-settings";
import {getPredictions} from "../neural-network/predictions";
import {FilePrefixEnum} from "../models/file-prefix.enum";
import {Tensor} from "onnxruntime-web";
import CustomButton from "./CustomButton";
import UploadFileButton from "./UploadFileButton";
import {loadActualShowedImage} from "../img-services/read-actual-image";
import Jimp from "jimp";
import {loadImageIntoCornerstone, loadNNImageIntoCornerstone} from "../img-services/img-cornerstone-loaders";
import View from "./View";
import {DiffButtonEnum} from "../models/diff-button.enum";
import {NnTypeEnum} from "../models/nn-type.enum";
import cornerstone from 'cornerstone-core';

const MainApp = () => {
    let lastStructureMask = NnTypeEnum.TUMOR;

    // init cornerstone tools in app
    initCornerstone();
    const clearCornerstoneCache = (): void => {
        cornerstone.imageCache.purgeCache();
    }

    // show About page or CornerstoneView component
    const [diffButton, setDiffButton] = useState<string>(DiffButtonEnum.ABOUT);
    const changeButtonState = () => {
        const newDiff = diffButton === DiffButtonEnum.BACK ? DiffButtonEnum.ABOUT : DiffButtonEnum.BACK;
        setDiffButton(newDiff);
    }

    // IDs used for cornerstone images viewer
    const [imagesIds, setImagesIds] = useState<string[]>([]);
    const [actualImgId, setActualImgId] = useState<string>();
    const [imgFiles, setImgFiles] = useState<{ [key: string]: File }>({});
    const [nnImages, setNnImages] = useState<{ [key: string]: any }>({});

    /**
     * Import JPEG, JPG or PNG image selected by user and show it in cornerstone view component
     * @param event - event carrying the image file
     */
    const importImageFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event) {
            const imageIds: string[] = cloneDeep(cacheFilesAndGetImageIds(event.target.files as FileList));
            clearCornerstoneCache();

            // set images and automatically trigger the image change in cornerstone view component
            setActualImgId(imageIds[0]);
            setImagesIds(imgIds => [...imageIds, ...imgIds]);

            console.log('File import COMPLETED!');
        }
    }

    /**
     * Load image imported by user into app into cornerstone view component
     *  - this loader is automatically selected by cornerstone thanks to the 'imageID' prefix = 'imgfile'
     *  - return promise in object, because of cornerstone
     * @param imageId - image id with 'imgfile' prefix (JPEG, JPG or PNG)
     */
    const loadImportedImage = (imageId: string): { promise: Promise<any> } => {
        return loadImageIntoCornerstone(imgFiles[imageId], imageId, cornerstone);
    }

    /**
     * Load image returned by Neural network into cornerstone view component
     *  - this loader is selected by cornerstone thanks to the 'imageId' prefix = 'nnfile'
     *  - return promise in object, because of cornerstone
     * @param imageId - image id with 'nnfile' prefix
     */
    const loadNNImage = (imageId: string): { promise: Promise<any> } => {
        return loadNNImageIntoCornerstone(nnImages[imageId], imageId, cornerstone, imgFiles[actualImgId], lastStructureMask);
    }

    /**
     * Cache image file imported by user and actualize 'imagesIds' array to trigger change image in cornerstone view component
     * @param files - all imported JPEG. JPG or PNG imagess
     */
    const cacheFilesAndGetImageIds = (files: FileList): string[] => {
        const importedIds = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            const importedFileId: string = `${FilePrefixEnum.IMG}:${(Math.round(Math.random() * 10000000))}`;

            // store the file with imageId as object key
            setImgFiles(images => ({
                ...images,
                [importedFileId]: file
            }));

            importedIds.push(importedFileId);
        }

        return importedIds;
    }

    /**
     * Save returned tensor mask into the nnImages array for further use
     * @param mask - mask in Tensor
     */
    const saveTensorMask = (mask: Tensor) => {
        clearCornerstoneCache();

        // create NN image id
        const maskImageId: string = `${FilePrefixEnum.NN}:${(Math.round(Math.random() * 10000000))}`;
        // store the mask with nnImageId as object key
        setNnImages(images => ({
            ...images,
            [maskImageId]: mask
        }));

        // set images and automatically trigger the image change in cornerstone view component
        setImagesIds([maskImageId, ...imagesIds]);
    }

    /**
     * Pass the image to the neural network and show the result mask image in cornerstone view component
     **/
    const getMask = async (nnType: NnTypeEnum) => {
        await loadActualShowedImage(imgFiles[actualImgId])
            .then((img: Jimp) => {
                return getPredictions(img, nnType)
            }).then((mask: Tensor) => {
                console.log(`Neural network prediction for ${nnType} COMPLETED!`);
                console.log('Returned Tensor', mask);
                saveTensorMask(mask);
            }).catch((e) => {
                console.log(`ERROR while getting prediction mask for ${nnType} in Neural network: `, e);
            })
    }

    const getEyesMask = async () => {
        lastStructureMask = NnTypeEnum.EYE;
        await getMask(NnTypeEnum.EYE);
    }

    const getBrainstemMask = async () => {
        lastStructureMask = NnTypeEnum.BRAINSTEM;
        await getMask(NnTypeEnum.BRAINSTEM);
    }

    const getTumorMask = async () => {
        lastStructureMask = NnTypeEnum.TUMOR;
        await getMask(NnTypeEnum.TUMOR);
    }

    // register the images loaders to cornerstone
    cornerstone.registerImageLoader(FilePrefixEnum.IMG, loadImportedImage)
    cornerstone.registerImageLoader(FilePrefixEnum.NN, loadNNImage)

/*    if (loadImageAtStart) {
        loadImageAtStart = false;

        getImageAsJimp('https://drive.google.com/uc?export=download&id=1y_bASrdwaxEdQpfhcGDU_3QbkriUeMpt', 512, 512)
            .then((img: Jimp) => {
                // set images and automatically trigger the image change in cornerstone view component
                const imgFileId: string = `${FilePrefixEnum.IMG}:${(Math.round(Math.random() * 10000000))}`;
                const arrayBufferView = new Uint8Array(img.bitmap.data);
                const blob = new Blob([arrayBufferView]);
                const file = new File([blob], "filename")

                // store the file with imageId as object key
                setImgFiles(images => ({
                    ...images,
                    [imgFileId]: file
                }));

                setActualImgId(imgFileId);
                setImagesIds(imgIds => [...imgIds, imgFileId]);
            })
    }*/

    return (
        <div className={'container'}>
            <div className={'left_menu'}>
                <h2 className={'main_header'}>
                    Automatic <br/>
                    Brain <br/>
                    Structures <br/>
                    Segmentation
                </h2>

                <hr/>

                <UploadFileButton importImageFile={importImageFile}/>
                <hr/>

                <div className={'masksText'}>
                    Get masks <br/>
                    for current image:
                </div>

                <CustomButton buttonName={"Tumor"} onClickFn={getTumorMask}/>
                <CustomButton buttonName={"Brainstem"} onClickFn={getBrainstemMask}/>
                <CustomButton buttonName={"Eyes"} onClickFn={getEyesMask}/>
                <hr/>

                <button className={'aboutButton'}
                        onClick={changeButtonState}>{diffButton}</button>

            </div>

            <div className={'mainView'}>
                <View imagesIds={imagesIds} pageType={diffButton}/>
            </div>

        </div>
    )
}

export default MainApp
