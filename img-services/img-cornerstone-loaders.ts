import {tensorToImageData} from "./tensor-to-img";
import {Tensor} from "onnxruntime-web";
import {loadActualShowedImage} from "./read-actual-image";
import Jimp from "jimp";
import {NnTypeEnum} from "../models/nn-type.enum";

/**
 * SOURCES
 * - https://github.com/webnamics/cornerstoneFileImageLoader/blob/master/src/createImage.js
 */

let canvas;
if (typeof window !== 'undefined') {
    canvas = document.createElement('canvas');
}

/**
 * Load image imported by user into app into cornerstone view component
 *  - this loader is automatically selected by cornerstone thanks to the 'imageID' prefix = 'imgfile'
 *  - return promise in object, because of cornerstone
 * @param image - JPEG, JPG or PNG image as File
 * @param imageId - image id with 'imgfile' prefix
 * @param cornerstone - cornerstone class
 */
export const loadImageIntoCornerstone = (image: File, imageId: string, cornerstone): { promise: Promise<any> } => {
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
        fileReader.readAsArrayBuffer(image);
    }).catch((e) => {
        console.log('Error while loading the image file: ', e);
    })

    return {
        promise
    }
}

/**
 * Load image returned by Neural network into cornerstone view component
 *  - this loader is selected by cornerstone thanks to the 'imageId' prefix = 'nnfile'
 *  - return promise in object, because of cornerstone
 * @param image - mask from neural network as Tensor
 * @param imageId - image id with 'nnfile' prefix
 * @param cornerstone - cornerstone class
 * @param actualImageFile - last imported MRI image
 * @param structureType - needed structure type
 */
export const loadNNImageIntoCornerstone = (image: Tensor, imageId: string, cornerstone, actualImageFile, structureType: NnTypeEnum): { promise: Promise<any> } => {
    const promise = new Promise((resolve, reject) => {

        const actualImage = loadActualShowedImage(actualImageFile)

        actualImage.then((jipImg: Jimp) => {
            // convert vector returned by the neural network to image data
            const img = tensorToImageData(image, jipImg, structureType);
            // convert buffer to image that can be used in cornerstone view component
            const imagePromise = arrayBufferToImage(img.data);

            return imagePromise
        }).then((image) => {
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
 * Create cornerstone object for specific image
 *
 * @param image - An Image
 * @param imageId - the imageId for this image
 * @param cornerstone - cornerstone init object
 * @returns Cornerstone Image Object
 */
export const createImage = (image: HTMLImageElement, imageId: string, cornerstone: any) => {
    // extract the attributes we need
    const rows = image.naturalHeight ?? image.height;
    const columns = image.naturalWidth ?? image.width;


    /**
     * Create the image in fake canvas and get data from the element
     */
    function getPixelData() {
        const context = canvas.getContext('2dcreateImage');
        canvas.height = image.naturalHeight;
        canvas.width = image.naturalWidth;
        context?.drawImage(image, 0, 0);
        const imageData = context?.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
        return imageData?.data;
    }

    return {
        imageId,
        minPixelValue: 0,
        maxPixelValue: 255,
        slope: 1,
        intercept: 0,
        windowCenter: 128,
        windowWidth: 255,
        render: cornerstone.renderWebImage,
        getPixelData,
        getImage: () => image,
        rows,
        columns,
        height: rows,
        width: columns,
        color: true,
        rgba: false,
        columnPixelSpacing: undefined,
        rowPixelSpacing: undefined,
        invert: false,
        sizeInBytes: rows * columns * 4
    };
}

/**
 * Convert the file ArrayBuffer result into HTMLImageElement for further use
 * @param arrayBuffer - image object as ArrayBuffer
 */
const arrayBufferToImage = (arrayBuffer: ArrayBuffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const arrayBufferView = new Uint8Array(arrayBuffer);
        const blob = new Blob([arrayBufferView]);
        const imageUrl = URL.createObjectURL(blob)

        image.onload = () => {
            resolve(image);
            URL.revokeObjectURL(imageUrl);
        };

        image.onerror = (error) => {
            URL.revokeObjectURL(imageUrl);
            reject(error);
        };

        image.src = imageUrl;
    }).catch((e) => {
        console.log('Error while creating image from arrayBuffer: ', e);
    });
}
