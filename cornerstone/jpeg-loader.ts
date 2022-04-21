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
    const rows = image.naturalHeight;
    const columns = image.naturalWidth;

    /**
     * Create the image in fake canvas and get data from the element
     */
    function getPixelData () {
        const context = canvas.getContext('2d');
        canvas.height = image.naturalHeight;
        canvas.width = image.naturalWidth;
        context?.drawImage(image, 0, 0);
        const imageData = context?.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
        return imageData?.data;
    }

    // Extract the various attributes we need
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
export const arrayBufferToImage = (arrayBuffer: ArrayBuffer): Promise<HTMLImageElement>  => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        const arrayBufferView = new Uint8Array(arrayBuffer);
        const blob = new Blob([arrayBufferView]);
        const imageUrl = URL.createObjectURL(blob)

        image.src = imageUrl;
        image.onload = () => {
            resolve(image);
            URL.revokeObjectURL(imageUrl);
        };

        image.onerror = (error) => {
            URL.revokeObjectURL(imageUrl);
            reject(error);
        };
    });
}
