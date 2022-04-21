import {Tensor} from 'onnxruntime-web';
import * as Jimp from 'jimp';
import {Image} from 'image-js';


export async function getImageTensorFromPath(imagePath: string, dims: number[] = [1, 3, 512, 512]): Promise<Tensor> {
    let image = await loadImageFromPath(imagePath, dims[2], dims[3]);
    // convert image to tensor
    let imageTensor = imageDataToTensor(image, dims);
    // return the tensor
    return imageTensor;
}

async function loadImageFromPath(path: string, width: number, height: number): Promise<Jimp> {
    // Use Jimp to load the image and resize it.
    let imageData = await Jimp.default.read(path).then((imageBuffer: Jimp) => {
        return imageBuffer.resize(width, height);
    });

    return imageData;
}

function imageDataToTensor(image: any, dims: number[]): Tensor {
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

export async function convertTensorToImage(tensor: Tensor): Promise<any> {
    const imgBuffer = new Float32Array()
    const img = await Jimp.default.read(tensor.data as any)
        .then(image => {
            console.log('image', image)
            return image;
            // Do stuff with the image.
        })
        .catch(err => {
            // Handle an exception.
            console.log('err', err);
            return undefined;
        });
    // const image = new ImageData(tensor.data as any, tensor.dims[2], tensor.dims[3]);
    // console.log('image', image);
    return img;
}

/*export function convertTensorToImageCanvas(tensor: Tensor) {
// create an offscreen canvas
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

// size the canvas to your desired image
    canvas.width = tensor.dims[2];
    canvas.height = tensor.dims[3];


// put the modified pixels back on the canvas
    ctx.putImageData({data: tensor.data as any, height: tensor.dims[2], width: tensor.dims[3]}, 0, 0);

// create a new img object
    let image = new Image();

// set the img.src to the canvas data url
    image.src = canvas.toDataURL();

// append the new img object to the page
    console.log('image convertTensorToImageCanvas', image);
    document.body.appendChild(image);

    return ctx;
}*/

export function convertTensorToImageTF(tensor: Tensor) {
    const img = new Image({data: tensor.data as any, width: tensor.dims[2], height: tensor.dims[3], components: 2, alpha: 0})
    console.log('img', img);
    return img;
}
