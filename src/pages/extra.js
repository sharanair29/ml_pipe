




import React, {Component} from 'react';
import testDog from '../dogTest.jpg'
import * as automl from '@tensorflow/tfjs-automl'
import '@tensorflow/tfjs-backend-webgl';
import firebase from 'firebase/compat/app';
import image from 'react-firebase-file-uploader/lib/utils/image';
import 'firebase/compat/database';
import { SparseFillEmptyRows } from '@tensorflow/tfjs';
import 'firebase/compat/firestore';

class AutoClassification extends Component {

    state = {
        imagesThatNeedInference: [],
        nextImage: {},
        currentImage: {},
        currentImageObj: {},
        winner: '',
        winningPrediction: {}
    }

    componentDidMount = () => {
        this.getImages()
    }

    getImages = async() =>{
        let imagesInRTDB = firebase.database().ref('classification/newPhotos').orderByChild('viewed').equalTo(false)

        await imagesInRTDB.on('value', (snapshot) => {
            let images = []
            snapshot.forEach((childSnapshot) =>{
                let childKey = childSnapshot.key
                let childData = childSnapshot.val()

                childData.rtdbKey = childKey
                images.push(childData)
            })

            if(images.length > 0) {
                this.setState({
                    imagesThatNeedInference: images,
                    nextImage: [images.length-1],
                    currentImage: images[images.length-1].url
                })
            }
        })

        
    }

    getNextImage = async() => {
        let images = this.state.imagesThatNeedInference
        let nextImage = images.pop()

        this.setState({
            currentImageObj: nextImage
        })

        console.log('fetching', nextImage.url)

        await fetch(nextImage.url)
            .then(async response => response.blob())
            .then(async image => {
                let element = await document.getElementById('animal_image')
                await element.setAttribute('src', URL.createObjectURL(image))
                await this.classifyImage()
            })

    }
    

    classifyImage = async() => {
        const model = await automl.loadImageClassification('./image_classification_model_v2/model.json')
        const img = document.getElementById('animal_image')
        const predictions = await model.classify(img)

        console.log('predictions', predictions)
    }
    render() {
        return (
            <div>
                This is the autoclassification page
                <button onClick={() => this.getNextImage()}>Start</button>
                <div>
                    <img id="animal_image" src={this.state.currentImage} alt=" a test"/>
                </div>
            </div>
        );
    }
}

export default AutoClassification;