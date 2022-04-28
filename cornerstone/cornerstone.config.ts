/**
 * All Cornerstone config parameters
 */

/**
 * Define the Cornerstone tools
 *  - based on https://tools.cornerstonejs.org/
 */
export const cornerstoneCustomTools = [
    // Mouse
    {
        name: 'Wwwc',
        mode: 'active',
        modeOptions: {mouseButtonMask: 1},
    },
    {
        name: 'Zoom',
        mode: 'active',
        modeOptions: {mouseButtonMask: 2},
    },
    {
        name: 'Pan',
        mode: 'active',
        modeOptions: {mouseButtonMask: 4},
    },
    // Scroll
    {name: 'StackScrollMouseWheel', mode: 'active'},
    // Touch
    {name: 'PanMultiTouch', mode: 'active'},
    {name: 'ZoomTouchPinch', mode: 'active'},
    {name: 'StackScrollMultiTouch', mode: 'active'},
]

/**
 * Get default cornerstone images
 *
 *  - source: ttps://docs.cornerstonejs.org/concepts/image-loaders.html
 */
export const dicomImagesFromWeb = [
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.7.dcm',
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.8.dcm',
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.9.dcm',
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.10.dcm',
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm',
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm'
]
