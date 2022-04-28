import {Tensor, InferenceSession} from "onnxruntime-web";

/**
 * Crate and run neural network session with wasm in browser
 *  - before first run => copy the NN model into 'models' neural-network/models' folder
 * @param data - image data for segmentation as tensor
 */
export const createAndRunSession = async (data: Tensor): Promise<Tensor> => {
    // import the neural network model
    const session = await InferenceSession
        .create('./_next/static/chunks/pages/brain_tumor_segmentation.onnx',
            {executionProviders: ['wasm'], graphOptimizationLevel: 'all'});

    // run the session with selected image data
    const results = await runSession(session, data);
    return results;
}

/**
 * Run the created session in browser
 * @param session - session with neural network model
 * @param data - image data for segmentation as tensor
 */
const runSession = async (session: InferenceSession, data: Tensor): Promise<Tensor> => {
    // create feeds with the input name from model export and the preprocessed data.
    const feeds: Record<string, Tensor> = {};
    feeds[session.inputNames[0]] = data;

    // run the session
    const outputData = await session.run(feeds);
    return outputData[session.outputNames[0]];
}

