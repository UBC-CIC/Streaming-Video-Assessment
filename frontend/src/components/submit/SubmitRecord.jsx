import React, { useRef, useState, useEffect } from "react";
import Video from "./Video";
import SubmitRecordControls from "./SubmitRecordControls";

const SubmitRecord = ({
  assignmentData,
  confirmSubmission,
  detectFaces,
  modelsLoaded,
}) => {
  const { timeLimitMinutes, description, allowFaceBlur, name } = assignmentData;

  const [uploadedVideoUrl, setUploadedVideoUrl] = useState();
  const recordedChunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);

  const [intentRecording, setIntentRecording] = useState(false);
  const [recording, setRecording] = useState(false);

  const [secondsRemaining, setSecondsRemaining] = useState(
    timeLimitMinutes * 60,
  );
  const [blurface, setBlurface] = useState(false);

  const [hasRecorded, setHasRecorded] = useState(false);
  const canvasRef = useRef(null);

  const startNewRecording = () => {
    if (!canvasRef.current) {
      console.warn("No canvas when starting new recording!");
    }

    const canvasFrameRate = 25;
    const options = { mimeType: "video/webm; codecs=vp9" };

    console.log("Creating media recorder", { canvas: canvasRef.current });
    mediaRecorderRef.current = new MediaRecorder(
      canvasRef.current.captureStream(canvasFrameRate),
      options,
    );

    mediaRecorderRef.current.ondataavailable = (e) => {
      console.log("data-available");
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
        console.log(recordedChunksRef.current);
        // download();
      } else {
        // …
      }
    };

    mediaRecorderRef.current.onstop = () => {
      console.log("Media recorder stopped");

      const blob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);

      console.log({ blob, url, chunks: recordedChunksRef.current });
      setUploadedVideoUrl(url);

      recordedChunksRef.current = [];

      setRecording(false);
      setHasRecorded(true);
    };

    setRecording(true);
    mediaRecorderRef.current.start(1000);
  };

  useEffect(() => {
    console.log({ recording });

    if (intentRecording) {
      console.log("Start recording");
      startNewRecording();
    } else {
      console.log("Stop recording");
      mediaRecorderRef.current?.stop();
    }
  }, [intentRecording]);

  return (
    <div className="md:h-dvh">
      <div className="m-5 mb-0">
        <span className="text-black text-6xl self-center max-md:max-w-full max-md:text-4xl">
          {name}
        </span>
        <div className="bg-black self-stretch mt-1 shrink-0 h-0.5 max-md:max-w-full" />
      </div>

      <div className="grid grid-cols-1 m-5 mt-2 md:grid-cols-3">
        {/* TODO: set max height on video to not push controls off the page */}
        <div className="w-full border order-1 md:col-span-2">
          {hasRecorded && !recording ? (
            <video
              controls
              // TODO: replace with actual video
              src={uploadedVideoUrl}
            ></video>
          ) : (
            <Video
              blurface={blurface}
              recording={recording}
              detectFaces={detectFaces}
              modelsLoaded={modelsLoaded}
              mediaRecorderRef={mediaRecorderRef}
              canvasRef={canvasRef}
            />
          )}
        </div>

        <div className="order-3 md:order-2 md:mx-2">{description}</div>

        {/* Controls */}

        {hasRecorded ? (
          <div className="order-4 md:order-3">
            <button
              className="button text-white text-center justify-center text-l font-black bg-green-500 hover:bg-green-400 self-center px-5 py-2 text-nowrap rounded-md"
              onClick={() => {
                setHasRecorded(false);
              }}
            >
              Re-record
            </button>
            <button
              className="button text-white text-center justify-center text-l font-black bg-indigo-500 hover:bg-indigo-400 self-center px-5 py-2 text-nowrap rounded-md"
              onClick={() => {
                confirmSubmission();
              }}
            >
              Submit
            </button>
          </div>
        ) : (
          <SubmitRecordControls
            recording={recording}
            setIntentRecording={setIntentRecording}
            intentRecording={intentRecording}
            secondsRemaining={secondsRemaining}
            allowFaceBlur={allowFaceBlur}
            blurface={blurface}
            setBlurface={setBlurface}
            modelsLoaded={modelsLoaded}
          />
        )}
      </div>
    </div>
  );
};

export default SubmitRecord;
