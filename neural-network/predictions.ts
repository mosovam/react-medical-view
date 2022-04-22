import {createAndRunSession} from "./model-runner";
import {
    convertTensorToImageTF,
    getImageTensorFromPath
} from "./prepare-image";

export async function getPredictions(path): Promise<any> {
    if (path) {
        // 1. Convert image to tensor
        const imageTensor = await getImageTensorFromPath(path);
        // 2. Run model
        let result = await createAndRunSession(imageTensor);
        // 3. Return result
        // result = await convertTensorToImage(result);
        result = convertTensorToImageTF(result);
        return result;
    }

    console.log('Path for image is undefined!');
    return;
}
