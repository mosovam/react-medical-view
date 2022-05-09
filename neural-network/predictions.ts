import {createAndRunSession} from "./model-runner";
import {
    convertImageIntoTensor
} from "../img-services/img-to-tensor";
import {Tensor} from "onnxruntime-web";
import Jimp from "jimp";
import {NnTypeEnum} from "../models/nn-type.enum";

/**
 * Get predictions from neural network, prepare image and run the session
 * @param img - image in Jimp format
 * @param nnType - type representation of neural network
 */
export const getPredictions = async (img: Jimp, nnType: NnTypeEnum): Promise<Tensor> => {
    if (img) {
        // 1. Convert image to tensor
        const imageTensor: Tensor = await convertImageIntoTensor(img);
        // 2. Run model and return results
        let result: Tensor = await createAndRunSession(imageTensor, nnType);
        return result;
    }

    console.log('Path for image is undefined!');
    return;
}
