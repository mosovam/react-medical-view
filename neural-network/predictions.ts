import {createAndRunSession} from "./model-runner";
import {
    convertImageIntoTensor
} from "./prepare-image";
import {Tensor} from "onnxruntime-web";
import {NeuralNetworkType} from "../components/MainApp";

/**
 * Get predictions from neural network, prepare image and run the session
 * @param path - web path to the image
 * @param nnType - type representation of neural network
 */
export const getPredictions = async (path, nnType: NeuralNetworkType): Promise<Tensor> => {
    if (path) {
        // 1. Convert image to tensor
        const imageTensor: Tensor = await convertImageIntoTensor(path);
        // 2. Run model and return results
        let result: Tensor = await createAndRunSession(imageTensor, nnType);
        return result;
    }

    console.log('Path for image is undefined!');
    return;
}
