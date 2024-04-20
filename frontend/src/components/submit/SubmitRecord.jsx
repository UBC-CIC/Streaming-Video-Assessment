import React, { useRef, useState, useEffect } from "react";
import Video from "./Video";
import SubmitRecordControls from "./SubmitRecordControls";
import HasRecordedVideo from "./HasRecordedVideo";

import {
  initializeUpload,
  completeUpload,
  uploadPart,
  getNextUploadUrl,
} from "../../helpers/uploaderApi";

const mimeType = "video/mp4";
const RECORDER_TIME_SLICE = 60000; // ms

const SubmitRecord = ({
  assessmentData,
  confirmSubmission,
  detectFaces,
  modelsLoaded,
}) => {
  const { timeLimitSeconds, description, allowFaceBlur, name } = assessmentData;

  const [uploadedVideoUrl, setUploadedVideoUrl] = useState();
  const mediaRecorderRef = useRef(null);
  const audioStreamTrackRef = useRef(null);
  const uploadData = useRef({});

  const [intentRecording, setIntentRecording] = useState(false);
  const [recording, setRecording] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState("NotReady");

  const [secondsRemaining, setSecondsRemaining] = useState(timeLimitSeconds);
  const [blurface, setBlurface] = useState(false);

  const [hasRecorded, setHasRecorded] = useState(false);
  const canvasRef = useRef(null);

  const flushBlobBuffer = () => {
    while (
      uploadData.current.blobBuffer.length > 0 &&
      uploadData.current.uploadUrls.length > 0
    ) {
      console.log("Flushing buffer", uploadData.current);

      const blob = uploadData.current.blobBuffer.shift();
      const uploadUrl = uploadData.current.uploadUrls.shift();

      const promise = uploadPart(uploadUrl.signedUrl, blob).then((etag) => {
        uploadData.current.parts.push({
          partNumber: uploadUrl.partNumber,
          etag,
        });
      });

      uploadData.current.promises.push(promise);
    }
  };

  const startNewRecording = () => {
    if (!canvasRef.current) {
      console.warn("No canvas when starting new recording!");
    }

    const canvasFrameRate = 25;
    const options = { mimeType };

    const stream = canvasRef.current.captureStream(canvasFrameRate);

    if (audioStreamTrackRef.current) {
      stream.addTrack(audioStreamTrackRef.current);
    }

    mediaRecorderRef.current = new MediaRecorder(stream, options);

    mediaRecorderRef.current.ondataavailable = (e) => {
      console.log("data-available");
      if (e.data.size > 0) {
        // add the data to the buffer
        uploadData.current.blobBuffer.push(e.data);

        // get the next upload url
        uploadData.current.initialization // Wait for the initialization to complete
          .then(() =>
            getNextUploadUrl(
              assessmentData.id,
              assessmentData.secret,
              uploadData.current.uploadId,
              ++uploadData.current.maxPartNumber,
            ),
          )
          .then((jsonResponse) => {
            uploadData.current.uploadUrls.push({
              partNumber: jsonResponse.partNumber,
              signedUrl: jsonResponse.signedUrl,
            });
          });

        // flush the buffer
        flushBlobBuffer();
        // download();
      } else {
        // …
      }
    };

    mediaRecorderRef.current.onstop = () => {
      console.log("Media recorder stopped");

      console.log("Media recorder stopped", uploadData.current);

      clearInterval(uploadData.current.interval);

      setUploadedVideoUrl(null);

      uploadData.current.initialization.then(flushBlobBuffer).then(() =>
        Promise.all(uploadData.current.promises)
          .then(() =>
            completeUpload(
              assessmentData.id,
              assessmentData.secret,
              uploadData.current.uploadId,
              uploadData.current.parts,
            ),
          )
          .then((jsonResponse) => {
            setUploadedVideoUrl(jsonResponse.signedUrl);
          }),
      );

      setRecording(false);
      setHasRecorded(true);
      setSecondsRemaining(timeLimitSeconds);
    };

    uploadData.current.parts = [];
    uploadData.current.promises = [];
    uploadData.current.blobBuffer = [];
    uploadData.current.uploadUrls = [];
    uploadData.current.initialization = initializeUpload(
      assessmentData.id,
      assessmentData.secret,
    )
      .then((jsonResponse) => {
        uploadData.current.uploadId = jsonResponse.uploadId;
        uploadData.current.maxPartNumber = jsonResponse.partNumber;
        uploadData.current.uploadUrls.push({
          partNumber: jsonResponse.partNumber,
          signedUrl: jsonResponse.signedUrl,
        });
      })
      .catch((e) => {
        // TODO: how do we want to handle this error better?
        console.error("Error initializing upload", e);
        setIntentRecording(false);
      });

    uploadData.current.interval = setInterval(() => {
      const timeElapsed = Math.floor(
        (Date.now() - uploadData.current.startTimestamp) / 1000,
      );

      if (timeElapsed > timeLimitSeconds) {
        mediaRecorderRef.current.stop();
        return;
      }

      setSecondsRemaining(Math.max(0, timeLimitSeconds - timeElapsed));
    }, 1000);

    uploadData.current.startTimestamp = Date.now();

    setRecording(true);
    mediaRecorderRef.current.start(RECORDER_TIME_SLICE);
  };

  useEffect(() => {
    if (intentRecording) {
      startNewRecording();
    } else {
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
        <div className="w-full order-1 md:col-span-2">
          {hasRecorded && !recording ? (
            <HasRecordedVideo
              uploadedVideoUrl={uploadedVideoUrl}
              className="w-full flex align-center justify-center"
            />
          ) : (
            <Video
              blurface={blurface}
              recording={recording}
              detectFaces={detectFaces}
              modelsLoaded={modelsLoaded}
              mediaRecorderRef={mediaRecorderRef}
              canvasRef={canvasRef}
              audioStreamTrackRef={audioStreamTrackRef}
              setVideoLoaded={setVideoLoaded}
              className="w-full flex align-center justify-center"
            />
          )}
        </div>

        <div className="order-3 md:order-2 md:mx-2 whitespace-pre-wrap">
          {description}
        </div>

        {/* Controls */}
        <div className="order-2 md:order-3 py-2 md:col-span-2">
          {hasRecorded ? (
            <div className="flex place-content-between justify-items-center">
              <button
                className="button text-white text-center justify-center text-l bg-green-500 hover:bg-green-400 self-center px-5 py-2 text-nowrap rounded-md"
                onClick={() => {
                  setHasRecorded(false);
                }}
              >
                Re-record
              </button>
              <button
                className="button text-white text-center justify-center text-l bg-indigo-500 hover:bg-indigo-400 self-center px-5 py-2 text-nowrap rounded-md disabled:bg-slate-500 disabled:hover:bg-slate-400 disabled:hover:cursor-not-allowed"
                onClick={() => {
                  confirmSubmission();
                }}
                disabled={!uploadedVideoUrl}
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
              videoLoaded={videoLoaded}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitRecord;
