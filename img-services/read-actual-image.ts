import * as Jimp from "jimp";

/**
 * Load actual showed image
 * @param file - image
 */
export const loadActualShowedImage = (file: File): Promise<Jimp | unknown> => {
    const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        // load the file and create image from it
        fileReader.onload = (e: ProgressEvent<FileReader>) => {
            if (e?.target?.result) {

                // convert buffer to image that can be used in cornerstone view component
                const imagePromise: Promise<Jimp | unknown> = arrayBufferToJimpImage(e.target.result as ArrayBuffer);

                imagePromise.then((image: Jimp) => {
                    resolve(image);
                }, reject);
            } else {
                throw Error();
            }
        };

        // read the loaded file
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(file);
    }).catch((e) => {
        console.log('Error while loading the image file: ', e);
    })

    return promise;
}


/**
 * Load image from web
 * @param path - web path to the image
 * @param width - image width
 * @param height - image height
 *
 *  * based on ONNX RunTime tutorial - https://onnxruntime.ai/docs/tutorials/web/classify-images-nextjs-github-template.html
 */
export const getImageAsJimp = async (path, width: number, height: number): Promise<Jimp> => {
    // Use Jimp to load the image and resize it.
    let imageData = await Jimp.default.read(path).then((imageBuffer: Jimp) => {
        // resize to the desired width and height
        return imageBuffer.resize(width, height);
    });

    return imageData;
}

/**
 * Convert the file ArrayBuffer result into HTMLImageElement for further use
 * @param arrayBuffer - image object as ArrayBuffer
 */
const arrayBufferToJimpImage = (arrayBuffer: ArrayBuffer): Promise<Jimp | unknown> => {
    let imageUrl;

    return new Promise(async (resolve, reject) => {
        const arrayBufferView = new Uint8Array(arrayBuffer);
        const blob = new Blob([arrayBufferView]);
        const imageUrl = URL.createObjectURL(blob)

        // get the image as JIMP
        const jimpImg = await getImageAsJimp(imageUrl, 512, 512);

        // resolve image and revoke URL after resolving
        URL.revokeObjectURL(imageUrl);
        resolve(jimpImg);
    }).catch((e) => {
        URL.revokeObjectURL(imageUrl);
        console.log('Error while creating image from arrayBuffer: ', e);
    });
}

