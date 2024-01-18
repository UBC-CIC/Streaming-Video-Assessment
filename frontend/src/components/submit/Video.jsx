import React, { useRef, useEffect } from 'react';

const Video = ({class: cls, blurface}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        console.log(blurface)

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
        
        const drawFrame = () => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            if (blurface) {
                // Just to show we can draw on the canvas
                context.beginPath();
                context.arc(50, 50, 50, 0, 2 * Math.PI);
                context.fillStyle = 'red';
                context.fill();
            }

            requestAnimationFrame(drawFrame);
        };

        drawFrame();
    }, [blurface]);

    return (
        <div class={cls}>
            <canvas class="w-full" ref={canvasRef} />
            <video class="hidden" playsInline muted ref={videoRef} />
        </div>
    );
};

export default Video;
