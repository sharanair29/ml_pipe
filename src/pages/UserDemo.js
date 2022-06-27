import React, { Component } from 'react';
import firebase from 'firebase/compat/app';
import FileUploader from 'react-firebase-file-uploader'
import * as automl from '@tensorflow/tfjs-automl'
import '@tensorflow/tfjs-backend-webgl';
import image from 'react-firebase-file-uploader/lib/utils/image';
import 'firebase/compat/database';
import { SparseFillEmptyRows } from '@tensorflow/tfjs';
import 'firebase/compat/firestore';

class UserDemo extends Component {
    state ={
        imageStorageRef : 'userDemo',
        imgSrc: 'n/a',
        winner: '',
        winningPrediction : {}
    }

    handleUploadSuccess = async(filename) => {
        try {
            let {bucket, fullPath}= await firebase.storage().ref(this.state.imageStorageRef).child(filename).getMetadata()
            let downloadUrl = await firebase.storage().ref(this.state.imageStorageRef).child(filename).getDownloadURL()
            let newPhoto = {
                url: downloadUrl,
                bucket,
                fullPath,
                viewed: false,
                useAsTraining: false
            }

           

            this.setState({
                imgSrc : downloadUrl
            })
            
            this.getImage(downloadUrl)

        } catch (err) {
                console.log('there was an error uploading...', err)
        }
    }

    getImage = async(imgSrc) => {
    
      
        await fetch(imgSrc)
            .then(async response => response.blob())
            .then(async image => {
                let element = await document.getElementById("user_image")
                await element.setAttribute('src', URL.createObjectURL(image))
                await this.classifyImage()
             
            })
    }

    classifyImage = async() => {
        const model = await automl.loadImageClassification('./image_classification_model_v2/model.json')
        const img = document.getElementById('user_image')
        const predictions = await model.classify(img)

        console.log('predictions', predictions)

        let winner = await this.getWinner(predictions)

        this.savePrediction(winner, predictions)
    }

    savePrediction = async(winner, predictions) => {
        await firebase.firestore().collection('userUploadedClassification').add({
            predictions,
            ...this.state.currentImageObj,
            winningLabel: winner.label,
            winningScore: winner.prob

        })

    }

    getWinner = async(predictions) => {
        let winner = 0;
        let winningPrediction = {}

        predictions.forEach((prediction) =>{
            prediction.prob = Math.round((prediction.prob * 100).toFixed(2))
            if(prediction.prob > winner) {
                winner = prediction.prob
                winningPrediction = prediction
            }
        })

        this.setState({
            winner: winningPrediction.label,
            winningPrediction
        })

        return winningPrediction
    }


    render() {
        return (
            <div style={{padding: 32}}>
                This is an image classification uploader

                <br/>
                {this.state.winner 
                        ?<div>
                            <p>The winner is = <b>{this.state.winner}</b> with confidence of <b>{this.state.winningPrediction.prob && this.state.winningPrediction.prob}</b></p>
                        </div>
                        : <div>
                                <p>Upload an image to be classified...</p>
                        </div>
                }
                <br/>
                {this.state.imgSrc !== 'n/a' && <img id = "user_image" src={this.state.imgSrc} alt= ""/>}
                <br/>
                <FileUploader
                    accept="image/*"
                    storageRef={firebase.storage().ref(this.state.imageStorageRef)}
                    onUploadStart={this.handleUploadStart}
                    onUploadError={this.handleUploadError}
                    onUploadSuccess={this.handleUploadSuccess}
                    onProgress={this.handleProgress}
                />

            </div>
        );
    }
}

export default UserDemo;