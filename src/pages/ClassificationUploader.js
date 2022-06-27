import React, { Component } from 'react';
import firebase from 'firebase/compat/app';
import FileUploader from 'react-firebase-file-uploader'

class ClassificationUploader extends Component {
    state ={
        imageStorageRef : 'userUploaded/animals',
        imgSrc: 'n/a'
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

            let photoAdded = await firebase.database().ref('classification/newPhotos').push(newPhoto)
        } catch (err) {
                console.log('there was an error uploading...', err)
        }
    }

    render() {
        return (
            <div>
                this is a classification uploader

                <br/>
                {this.state.imgSrc !== 'n/a' && <img src={this.state.imgSrc} alt= ""/>}
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

export default ClassificationUploader;