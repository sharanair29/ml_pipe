


//TODO: configure project

// automl info
const project_name = "confident-coder-317909"
const project_region = 'us-central1'
const dataset_id = 'ICN7365765283669082112'

// bucket and labels

const bucket_prefix = 'animals'
// const labels = ['dog', 'cat', 'other']
const labels = ['animals']

const model_name = `${bucket_prefix}_${new Date().getTime()}`
const num_labels = labels.length
const img_threshold = 10;

// dependencies

const fs = require('fs')
const functions = require("firebase-functions");
const firebase = require('firebase-admin')
const {AutoMlClient} = require('@google-cloud/automl');
const { Storage } = require('@google-cloud/storage')
const cors = require('cors')({origin: true })

firebase.initializeApp()

const database = firebase.database()
const firestore = firebase.firestore()
const storage = new Storage()

const client = new AutoMlClient()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// new image uploads are grabbed and write to db

function writeToDB(path) {
    console.log('whats the path', path)
    database.ref(path).transaction(function(labelCount){
        return labelCount + 1
    })

}

exports.uploadToVCMBucket = functions.storage.object().onFinalize(event => {
    const file = storage.bucket(event.bucket).file(event.name)
    const newLocation = `gs://${project_name}-vcm/${event.name}`

    return file.copy(newLocation)
        .then((err, copiedFile, resp) => {
            return event.name.substring(0, event.name.lastIndexOf('/'))
        }).then((label) => {
            return writeToDB(label)
        });
})

function uploadToGcs(filepath) {
    return new Promise((resolve, reject) => {
        storage
            .bucket(`${project_name}-vcm`)
            .upload(filepath, {destination: `${bucket_prefix}.csv`})
            .then(() => {
                resolve('upload was succesful')
            })
            .catch(err => {
                reject(err)
            })
    })
}

function uploadToAutoML (csvPath) {
    return new Promise((resolve, reject) => {
        const request = {
            name: client.datasetPath(project_name, project_region, dataset_id),
            inputConfig: {
                "gcsSource" : { "inputUris ": [csvPath]}
            }
        }
        client.importData(request)
        .then(responses => {
            let op = responses[0]
            op.on('complete', (result, metadata, finalresp) => {
                resolve('dataset was uploaded successfully!')
            })
            op.on('error', err => {
                reject('error occured uploading dataset to automl')
            })
        })
    })
}

function checkFileType (type) {
    const allowedTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'ico']
    if(allowedTypes.includes(type)) {
        return true
    } else {
        return false
    }
}

function createCSV(bucket) {
    let csvString = ''
    return new Promise((resolve, reject) => {
        bucket.getFiles({prefix: bucket_prefix})
        .then(results => {
            for(let i in results[0]) {
                let filename = results[0][i].name
                let filetype = filename.substrong(filename.lastIndexOf('.') + 1, filename.length)
                let allowedFileType = checkFileType(filetype)

                if(allowedFileType) {
                    let strippedName = filename.substring(filename.indexOf(bucket_prefix) + bucket_prefix.length + 1, filename.length)
                    let label = strippedName.substring(0, strippedName.indexOf('/'))
                    let fileURL = `gs://${project_name}-vcm/${filename}`
                    csvString += `${fileURL}, ${label}\n`
                }
            }
            resolve(csvString)
        })
    })
}

exports.checkNumberOfImages = functions.database.ref(bucket_prefix).onWrite((snap, context) => {
    const afterData = snap.after.val()
    let num_label_with_enough_photos = 0

    for(let i in afterData){
        if(afterData[i] > img_threshold) {
            num_label_with_enough_photos += 1
        }
    }

    const automlBucketPath = storage.bucket(`${project_name}-vcm`)

    if(num_label_with_enough_photos == num_labels) {
        return createCSV(automlBucketPath)
        .then(csvData => {
            return fs.writeFile('/tmp/labels.csv', csvData, () => {})
        })

        .then(err => {
            if(err) {console.log('err', err)}
            console.log('csv was created')
            return uploadToGcs('/tmp/labels.csv')
        })

        .then((uploadResp) => {
            if(uploadResp != 'upload was successful') {
                console.log('there was an error uploading ...')
            } else {
                return uploadToAutoML(`gs://${project_name}-vcm/${bucket_prefix}.csv`)
            }
        })
    } else {
        return 'not enough photos yet'
    }
})