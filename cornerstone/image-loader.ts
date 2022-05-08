/**
 * SOURCES
 * - https://github.com/webnamics/cornerstoneFileImageLoader/blob/master/src/createImage.js
 */

let canvas;
if (typeof window !== 'undefined') {
    canvas = document.createElement('canvas');
}

/**
 * Create cornerstone object for specific JPEG image
 *
 * @param image - An Image
 * @param imageId - the imageId for this image
 * @param cornerstone - cornerstone init object
 * @returns Cornerstone Image Object
 */
export const createImage = (image: HTMLImageElement, imageId: string, cornerstone: any) => {
    // extract the attributes we need
    const rows = image.naturalHeight ?? image.height;
    const columns = image.naturalWidth ?? image.width;


    /**
     * Create the image in fake canvas and get data from the element
     */
    function getPixelData() {
        const context = canvas.getContext('2dcreateImage');
        canvas.height = image.naturalHeight;
        canvas.width = image.naturalWidth;
        context?.drawImage(image, 0, 0);
        const imageData = context?.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
        return imageData?.data;
    }

    return {
        imageId,
        minPixelValue: 0,
        maxPixelValue: 255,
        slope: 1,
        intercept: 0,
        windowCenter: 128,
        windowWidth: 255,
        render: cornerstone.renderWebImage,
        getPixelData,
        getImage: () => image,
        rows,
        columns,
        height: rows,
        width: columns,
        color: true,
        rgba: false,
        columnPixelSpacing: undefined,
        rowPixelSpacing: undefined,
        invert: false,
        sizeInBytes: rows * columns * 4
    };
}

/**
 * Convert the file ArrayBuffer result into HTMLImageElement for further use
 * @param arrayBuffer - image object as ArrayBuffer
 */
export const arrayBufferToImage = (arrayBuffer: ArrayBuffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const arrayBufferView = new Uint8Array(arrayBuffer);
        const blob = new Blob([arrayBufferView]);
        const imageUrl = URL.createObjectURL(blob)

        image.onload = () => {
            resolve(image);
            URL.revokeObjectURL(imageUrl);
        };

        image.onerror = (error) => {
            URL.revokeObjectURL(imageUrl);
            reject(error);
        };

        image.src = imageUrl;
    }).catch((e) => {
        console.log('Error while creating image from arrayBuffer: ', e);
    });
}

export const getImageFromFile = async (img: File):Promise<any> => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        // load the file and create image from it
        fileReader.onload = (e: ProgressEvent<FileReader>) => {
            if (e?.target?.result) {

                // convert buffer to image that can be used in cornerstone view component
                const imagePromise = arrayBufferToImage(e.target.result as ArrayBuffer);

                imagePromise.then((image) => {
                    resolve(image);
                }, reject);
            } else {
                throw Error();
            }
        };

        // read the loaded file
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(img);
    }).catch((e) => {
        console.log('Error while loading the JPEG file: ', e);
    })
}



