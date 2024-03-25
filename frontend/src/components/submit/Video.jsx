import React, { useRef, useState, useEffect } from "react";

const Video = ({
  className,
  blurface,
  detectFaces,
  canvasRef,
  audioStreamTrackRef,
}) => {
  const videoRef = useRef(null);
  const requestRef = useRef();
  const detectionBufferRef = useRef([]);
  const blurfaceRef = useRef(blurface);
  const [hasWarmedUp, setHasWarmedUp] = useState(false);

  useEffect(() => {
    blurfaceRef.current = blurface;
  }, [blurface]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    //
    const drawFrame = async () => {
      if (!hasWarmedUp && videoRef.current)
        detectFaces(videoRef.current).then(() => setHasWarmedUp(true));
      let detections =
        blurfaceRef.current && videoRef.current
          ? await detectFaces(videoRef.current)
          : [];

      // context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (detections.length > 0) {
        detectionBufferRef.current = { detections, timestamp: Date.now() };
      }

      // TODO: fix debouncing for more than one face
      if (detections.length === 0 && blurfaceRef.current) {
        if (detectionBufferRef.current?.timestamp + 1000 < Date.now()) {
          // console.log(
          //   "No faces detected for 1 second",
          //   detectionBufferRef.current?.timestamp,
          // );
        } else {
          detections = detectionBufferRef.current.detections;
          // console.log("Faces detected in last 1 second");
        }
      }

      for (const detection of detections ?? []) {
        context.filter = "blur(10px)";
        context.drawImage(
          video,
          detection.box.x,
          detection.box.y,
          detection.box.width,
          detection.box.height,
          detection.box.x,
          detection.box.y,
          detection.box.width,
          detection.box.height,
        );
        context.filter = "none";
      }

      requestRef.current = requestAnimationFrame(drawFrame);
    };

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        video.srcObject = stream;
        const settings = stream.getVideoTracks()[0].getSettings();
        audioStreamTrackRef.current = stream.getAudioTracks()[0];

        settings.width;
        settings.height;
        settings.frameRate;

        context.canvas.width = settings.width;
        context.canvas.height = settings.height;

        return video.play();
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      })
      .then(() => {
        requestRef.current = requestAnimationFrame(drawFrame);
      });

    return () => {
      cancelAnimationFrame(requestRef.current);
      video?.srcObject?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className={className}>
      <canvas
        className="max-w-full max-h-full"
        style={{ WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)" }}
        ref={canvasRef}
      />
      <video className="hidden" playsInline autoPlay muted ref={videoRef} />
    </div>
  );
};

export default Video;
