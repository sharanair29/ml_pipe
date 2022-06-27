import React, {Component} from 'react';
import testDog from '../dogTest.jpg'
import * as automl from '@tensorflow/tfjs-automl'
import '@tensorflow/tfjs-backend-webgl';

class ImageClassificationDemo extends Component {

    classifyImage = async() => {
        const model = await automl.loadImageClassification('./image_classification_model_v2/model.json')
        const img = document.getElementById('animal_image')
        const predictions = await model.classify(img)

        console.log('predictions', predictions)
    }
    render() {
        return (
            <div>
                This is the image classification demo page
                <button onClick={() => this.classifyImage()}>Classify Image</button>
                <div>
                    <img id="animal_image" src={testDog} alt=" a test"/>
                </div>
            </div>
        );
    }
}

export default ImageClassificationDemo;