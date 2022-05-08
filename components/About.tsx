import React from 'react';

const About = () => {
    return (
        <div className={'aboutText'}>
            <span>
                App created with the <a href={'https://nextjs.org/'} target="_blank">Next.js</a>, <a
                href={'https://reactjs.org/'} target="_blank">React</a>, <a href={'https://onnx.ai/'}
                                                                            target="_blank">ONNX</a> and the <a
                href={'https://docs.cornerstonejs.org/'} target="_blank">Cornerstone</a> library.
            <br/><br/>
                Practical part of my Bachelor thesis - Analysis of medical data using neural networks (<a
                href={'https://www.osu.cz/'}>OSU</a>, <a href={'https://prf.osu.cz/kip/'}>Applied Informatics</a>).
            <br/><br/>
                Perform analysis of magnetic resonance images of the brain in browser by AI. Automatic segmentation of brain tumor and organs at risks (eyes, brainstem) in imported JPEG or DICOM images.
            <br/><br/>
                Hope you will enjoy, thanks and have a nice day!
            </span>

            <hr/>

            <h3>Sources:</h3>

            GitHub <a href={'https://github.com/mosovam/react-medical-view'}>repository</a> with the app.<br/>

            GitHub <a href={'https://github.com/mosovam/nn-medical-view'}>repository</a> with the code for training
            neural networks.<br/>

            <a href={'https://drive.google.com/drive/folders/1Bl94d1WeUIYHmP8U5MOfwPyDLoyi5HR1?usp=sharing'}>Link</a> to
            folder which contains all used neural networks model in the ONNX format< br/>

            <hr/>

            <h3>How to use:</h3>
            1, Import your own MRI brain image in JPEG or DICOM format by click on the 'Import image' button<br/>
            2, Click on the 'Tumor', 'Brainstem' or 'Eye' button - depends on the mask which you need<br/>
            3, Wait for the neural network showing you the resulting mask<br/>

        </div>
    )
}

export default About
