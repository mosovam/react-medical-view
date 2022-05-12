import * as jpeg from "jpeg-js";
import {Tensor} from "onnxruntime-web";
import Jimp from "jimp";
import {NnTypeEnum} from "../models/nn-type.enum";

/**
 * Convert the Tensor from neural network into HTMLImageElement for further use
 * @param tensor - image as Tensor, returned from neural network
 * @param actualImage - actual showed MRI image
 * @param structureType - structure type for color setting
 */
export const tensorToImageData = (tensor: Tensor, actualImage: Jimp, structureType: NnTypeEnum): jpeg.BufferRet => {
    /**
     * Tensor data are between 0-1
     * its Float32Array
     * dims: [1, 2, 512, 512]
     */

    // 0, create 'fake' canvas element
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext("2d");
    const imgData = ctx.createImageData(tensor.dims[2], tensor.dims[3]);

    // have to iterate, the imgData itself is readonly
    let iBD = 0;
    while (iBD < imgData.data.length) {
        imgData.data[iBD] = actualImage.bitmap.data[iBD];
        imgData.data[iBD + 1] = actualImage.bitmap.data[iBD + 1];
        imgData.data[iBD + 2] = actualImage.bitmap.data[iBD + 2];
        imgData.data[iBD + 3] = actualImage.bitmap.data[iBD + 3];

        iBD += 4;
    }

    // Now you need to assign values to imgData array into groups of four (R-G-B-A)
    // 1, Get all needed data from tensor
    const half = tensor.size / 2;
    const tensorData: Float32Array = tensor.data as Float32Array;

    let j = 0;
    let i = 0;
    const structureColor = getStructureColor(structureType);

    // 2, go through all data and create R, G, B and alfa channels
    while (i < half) {
        const value = 255 - Math.round(tensorData[i] * 255);

        // add only segments to original image
        if (value > 200) {
            imgData.data[j] = structureColor.r;
            imgData.data[j + 1] = structureColor.g;
            imgData.data[j + 2] = structureColor.b;
            imgData.data[j + 3] = 255;
        }

        j += 4;
        i += 1;
    }

    // 5, encode the array into Img
    const toImg = encodeTheBufferIntoImage(imgData.data);
    return toImg;
}

/**
 * Create JPEG image from the array buffer
 * @param arrayBuffer - image data
 */
const encodeTheBufferIntoImage = (arrayBuffer: ArrayBuffer): jpeg.BufferRet => {
    const rawImageData = {
        data: arrayBuffer,
        width: 512,
        height: 512,
    };
    return jpeg.encode(rawImageData);
}

const getStructureColor = (structureType: NnTypeEnum): { r: number, g: number, b: number} => {
    switch (structureType) {
        case NnTypeEnum.BRAINSTEM:
            return {
                r: 134,
                g: 232,
                b: 232
            };
        case NnTypeEnum.EYE:
            return {
                r: 169,
                g: 68,
                b: 154
            };
        default:
            return {
                r: 169,
                g: 68,
                b: 21
            };
    }
}
