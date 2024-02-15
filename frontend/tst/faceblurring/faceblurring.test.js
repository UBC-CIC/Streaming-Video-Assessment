import fs from "fs";
import * as canvas from 'canvas';
import * as faceapi from "face-api.js";

const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

const faceDetectorOptions = new faceapi.TinyFaceDetectorOptions();

await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
]);

if (faceapi.nets.tinyFaceDetector.params && faceapi.nets.faceLandmark68Net.params &&
    faceapi.nets.faceRecognitionNet.params && faceapi.nets.faceExpressionNet.params) {

    // Models are ready, continue with the rest of the code
    const { Canvas, Image, ImageData } = canvas
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

    // const img = await canvas.loadImage('./images/1--Handshaking/1_Handshaking_Handshaking_1_781.jpg');
    // console.log(img)

    // const detections = await faceapi.detectAllFaces(img, faceDetectorOptions);

    // console.log(detections)
    // console.log(detections.length)

    const jsonData = fs.readFileSync("./labels.json");
    const labels = JSON.parse(jsonData);
    // console.log(labels["1--Handshaking/1_Handshaking_Handshaking_1_781.jpg"][0][0])

    let numImages = 0;
    let numTotalFaces = 0;
    let numUndercountedFaces = 0;
    let numOvercountedFaces = 0;
    let numImagesWithUndercountedFaces = 0;
    let numImagesWithOvercountedFaces = 0;
    let numImagesCorrect = 0;

    // for (const dirPath of fs.readdirSync("./images")) {
    const dirPath = "13--Interview"
        console.log("Conducting test of " + dirPath)
        for (const imagePath of fs.readdirSync(`./images/${dirPath}`)) {
            const img = await canvas.loadImage(`./images/${dirPath}/${imagePath}`);
            const detections = await faceapi.detectAllFaces(img, faceDetectorOptions);
            const numFaces = labels[`${dirPath}/${imagePath}`][0][0]
            // if (numFaces > 2) {
            //     console.log("Skipping testing image " + imagePath + " with " + numFaces + " faces");
            //     continue;
            // }
            if (numFaces > 1) {
                console.log("Skipping testing image " + imagePath + " with " + numFaces + " faces");
                continue;
            }
            console.log("Testing image " + imagePath);
            console.log("Predicted number of faces: " + detections.length);
            console.log("Actual number of faces: " + numFaces)
            numImages++;
            numTotalFaces += numFaces;
            if (detections.length < numFaces) {
                numUndercountedFaces += numFaces - detections.length;
                numImagesWithUndercountedFaces++;
            } else if (detections.length > numFaces) {
                numOvercountedFaces += detections.length - numFaces;
                numImagesWithOvercountedFaces++;
            } else {
                numImagesCorrect++;
            }
        }
    // }

    console.log("Total images processed: " + numImages);
    console.log("Total number of faces in images: " + numTotalFaces);
    console.log("Total number of undercounted faces: " + numUndercountedFaces);
    console.log("Total number of images with undercounted faces: " + numImagesWithUndercountedFaces);
    console.log("Total number of overcounted faces: " + numOvercountedFaces);
    console.log("Total number of images with overcounted faces: " + numImagesWithOvercountedFaces);
    console.log("Total number of images correct: " + numImagesCorrect);
    console.log((100 * numUndercountedFaces / numTotalFaces) + "% faces missed");

} else {
    console.error('Error: Models not loaded');
}
