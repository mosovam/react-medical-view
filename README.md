# React Medical View

## Under development right now (4/2022)!

App created with the [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [ONNX](https://onnx.ai/) and the [Cornerstone](https://docs.cornerstonejs.org/) library.

Practical part of my Bachelor thesis - Analysis of medical data using neural networks (OSU, Applied Informatics).

Perform analysis of magnetic resonance images of the brain in browser by AI. Automatic segmentation of brain tumor and organs at risks (eyes, brainstem) in imported JPEG or DICOM images.

## Prerequisites

### Add neural network models to the app

- there is problem with adding the models to the Git (push will fail because of model large size)
- [download](https://drive.google.com/file/d/17sgYd1M7gMgP3MdB_FU7GpL_43eFdsvd/view?usp=sharing) models
- add them to the `neural-network/models` folder
- check the model name with the one used in `neural-network/model-runner.ts` file -> `createAndRunSession` function

### Install CORS plugin to your browser

- app contains cross-domain requests
- [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino?hl=en)
  recommended
- turn it on (the orange C will appear in the bug icon)
- turn on all the `Enable-Access-Control ...` options in main menu

### Install dependencies

```bash
mpm install
```

### Development

```bash
npm run dev
```

Open app on localhost.

In case of some problems, check your Node.js version, it should be greater or equal v12.

### Thanks and have a nice day!
