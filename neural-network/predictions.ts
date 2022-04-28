import {createAndRunSession} from "./model-runner";
import {
    convertImageIntoTensor
} from "./prepare-image";
import {Tensor} from "onnxruntime-web";

/**
 * Get predictions from neural network, prepare image and run the session
 * @param path - web path to the image
 */
export const getPredictions = async (path: string): Promise<Tensor> => {
    if (path) {
        // 1. Convert image to tensor
        const imageTensor: Tensor = await convertImageIntoTensor(path);
        // 2. Run model and return results
        let result: Tensor = await createAndRunSession(imageTensor);
        return result;
    }

    console.log('Path for image is undefined!');
    return;
}
