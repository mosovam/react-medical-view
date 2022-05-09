import {Tensor} from 'onnxruntime-web';
import * as Jimp from 'jimp';

/**
 * Convert image into Tensor for use in neural network model
 * @param img - image in Jimp format
 * @param dims - image dimensions
 */
export const convertImageIntoTensor = async (img: Jimp, dims: number[] = [1, 3, 512, 512]): Promise<Tensor> => {
    return imageDataToTensor(img, dims);
}

/**
 * Convert image to Tensor for use as neural network input
 * @param image - image in JPEG, JPG or PNG format
 * @param dims - dimensions of the image
 *
 * based on ONNX RunTime tutorial - https://onnxruntime.ai/docs/tutorials/web/classify-images-nextjs-github-template.html
 */
const imageDataToTensor = (image: Jimp, dims: number[]): Tensor => {
    // 1. Get buffer data from image and create R, G, and B arrays.
    let imageBufferData = image.bitmap.data;
    const [redArray, greenArray, blueArray] = new Array(new Array<number>(), new Array<number>(), new Array<number>());

    // 2. Loop through the image buffer and extract the R, G, and B channels
    for (let i = 0; i < imageBufferData.length; i += 4) {
        redArray.push(imageBufferData[i]);
        greenArray.push(imageBufferData[i + 1]);
        blueArray.push(imageBufferData[i + 2]);
        // skip data[i + 3] to filter out the alpha channel
    }

    // 3. Concatenate RGB to transpose [224, 224, 3] -> [3, 224, 224] to a number array
    const transposedData = redArray.concat(greenArray).concat(blueArray);

    // 4. convert to float32
    let i, l = transposedData.length; // length, we need this for the loop
    // create the Float32Array size 3 * 224 * 224 for these dimensions output
    const float32Data = new Float32Array(dims[1] * dims[2] * dims[3]);
    for (i = 0; i < l; i++) {
        float32Data[i] = transposedData[i] / 255.0; // convert to float
    }

    // 5. create the tensor object from onnxruntime-web.
    const inputTensor = new Tensor("float32", float32Data, dims);
    return inputTensor;
}
