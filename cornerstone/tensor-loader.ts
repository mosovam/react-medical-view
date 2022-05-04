import * as jpeg from "jpeg-js";
import {Tensor} from "onnxruntime-web";

/**
 * Convert the Tensor from neural network into HTMLImageElement for further use
 * @param tensor - image as Tensor, returned from neural network
 */
export const tensorToImageData = (tensor: Tensor): jpeg.BufferRet => {
    /**
     * Tensor data are between 0-1
     * its Float32Array
     * dims: [1, 2, 512, 512]
     */

    console.log('tensor', tensor);
    // 0, create 'fake' canvas element
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext("2d");
    const imgData = ctx.createImageData(tensor.dims[2], tensor.dims[3]);


    // Now you need to assign values to imgData array into groups of four (R-G-B-A)
    // 1, Get all needed data from tensor
    const half = tensor.size / 2;
    const tensorData: Float32Array = tensor.data as Float32Array;

    let j = 0;
    let i = 0;

    // 2, go through all data and create R, G, B and alfa channels
    while (i < half) {
        imgData.data[j] = tensorData[i];
        imgData.data[j + 1] = tensorData[i];
        imgData.data[j + 2] = tensorData[i];
        imgData.data[j + 3] = 1;
        j += 4;
        i += 1;
    }

    // 4, Normalize the data
    for (let i = 0; i < imgData.data.length; i++) {
        // convert all pixels back to 0-255 RGB scale
        imgData.data[i] = Math.round(imgData.data[i] * 255);
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
    // TODO: nooo 512, use dimensions!
    const rawImageData = {
        data: arrayBuffer,
        width: 512,
        height: 512,
    };
    return jpeg.encode(rawImageData);
}
