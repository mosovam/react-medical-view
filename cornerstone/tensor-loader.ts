import * as jpeg from "jpeg-js";
import {Tensor} from "onnxruntime-web";

/**
 * Convert the Tensor from neural network into HTMLImageElement for further use
 * @param tensor - image as Tensor, returned from neural network
 */
export const tensorToImageData = (tensor: Tensor): jpeg.BufferRet => {
    // 1, Get all needed data from tensor => dimensions, data and dataLenght
    const dims = tensor.dims;
    const data = tensor.data;

    // TODO - use dimensions instead of 2
    const dataL = data.length / 2;

    const redArray = [];
    const greenArray = [];
    const blueArray = [];
    const alfaArray = [];

    // 2, go through all data and create R, G, B and alfa channels
    for (let i = 0; i < dataL; i++) {
        redArray.push(data[i]);
        greenArray.push(data[i]);
        blueArray.push(data[i]);
        // mask, grayscale, no alfa data
        alfaArray.push(0);
    }

    // 3, Concatenate the RGB to number array
    const concatData = redArray.concat(greenArray).concat(blueArray).concat(alfaArray);

    // 4, Crate buffer from the data and normalizeit
    const xData = new ArrayBuffer(dims[2] * dims[3] * 3);
    for (let i = 0; i < data.length; i++) {
        // convert all pixels back to 0-255 RGB scale
        xData[i] = Math.round(concatData[i] * 255);
    }

    // 5, encode the array into Img
    const toImg = encodeTheBufferIntoImage(xData);
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
