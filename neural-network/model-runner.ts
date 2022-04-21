import * as ort from 'onnxruntime-web';

export async function createAndRunSession(data: any): Promise<any> {
    const session = await ort.InferenceSession
        .create('./_next/static/chunks/pages/brain_tumor_segmentation.onnx',
            {executionProviders: ['wasm'], graphOptimizationLevel: 'all'});

    const results = await runSession(session, data);
    return results;
}

async function runSession(session: ort.InferenceSession, data: any): Promise<any> {
    // create feeds with the input name from model export and the preprocessed data.
    const feeds: Record<string, ort.Tensor> = {};
    feeds[session.inputNames[0]] = data;

    console.log('feeds', feeds);

    // run the session
    const outputData = await session.run(feeds);
    return outputData[session.outputNames[0]];
}

