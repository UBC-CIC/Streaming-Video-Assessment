import React, { useRef, useState, useEffect } from 'react';

import * as faceapi from 'face-api.js';


const Video = ({class: cls, blurface}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const requestRef = useRef()

    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [captureVideo, setCaptureVideo] = useState(false);

    

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const loadModels = async () => {
            const MODEL_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";
        

            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]).then(() => console.log("Loaded models")).then(setModelsLoaded(true));
        }
        loadModels();


        // TODO: Include audio
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                video.srcObject = stream;
                const settings = stream.getVideoTracks()[0].getSettings();

                settings.width
                settings.height
                settings.frameRate
                
                context.canvas.width = settings.width;
                context.canvas.height = settings.height;

                video.play();
            })
            .catch((error) => {
                console.error('Error accessing webcam:', error);
            });


        // return () => {
        //     video.srcObject.getTracks().forEach((track) => track.stop());
        // };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const drawFrame = async () => {
            
            // 

            const detections = (modelsLoaded && blurface ?
                await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                : []
                );

            // context.clearRect(0, 0, canvas.width, canvas.height)
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            for (const detection of detections) {
                context.filter = "blur(10px)"
                context.drawImage(video, detection.box.x, detection.box.y, detection.box.width, detection.box.height,
                    detection.box.x, detection.box.y, detection.box.width, detection.box.height);
                context.filter = "none"
            }

            // requestRef.current = requestAnimationFrame(drawFrame);
        };

        // TODO: fix request animation frames
        requestRef.current = setInterval(drawFrame, 1000/30)

        // requestRef.current = requestAnimationFrame(drawFrame);

        return () => {
            // cancelAnimationFrame(requestRef.current);
            clearInterval(requestRef.current)
        }
    }, [blurface, modelsLoaded]);

    return (
        <div className={cls}>
            <canvas className="w-full" ref={canvasRef} />
            <video className="hidden" playsInline autoPlay muted ref={videoRef} />
        </div>
    );
};

export default Video;
