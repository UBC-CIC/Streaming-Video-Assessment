import React, { useRef, useState, useEffect } from "react";
import Video from "./Video";
import SubmitRecordControls from "./SubmitRecordControls";

import {
  initializeUpload,
  completeUpload,
  uploadPart,
  getNextUploadUrl,
} from "../../helpers/uploaderApi";

const mimeType = "video/webm; codecs=vp9";
const RECORDER_TIME_SLICE = 60000; // ms

const SubmitRecord = ({
  assignmentData,
  confirmSubmission,
  detectFaces,
  modelsLoaded,
}) => {
  const { timeLimitSeconds, description, allowFaceBlur, name } = assignmentData;

  const [uploadedVideoUrl, setUploadedVideoUrl] = useState();
  const mediaRecorderRef = useRef(null);
  const audioStreamTrackRef = useRef(null);
  const uploadData = useRef({});

  const [intentRecording, setIntentRecording] = useState(false);
  const [recording, setRecording] = useState(false);

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
        getNextUploadUrl(
          assignmentData.id,
          assignmentData.secret,
          uploadData.current.uploadId,
          ++uploadData.current.maxPartNumber,
        ).then((jsonResponse) => {
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

      Promise.all(uploadData.current.promises)
        .then(() =>
          completeUpload(
            assignmentData.id,
            assignmentData.secret,
            uploadData.current.uploadId,
            uploadData.current.parts,
          ),
        )
        .then((jsonResponse) => {
          setUploadedVideoUrl(jsonResponse.signedUrl);

          setRecording(false);
          setHasRecorded(true);
          setSecondsRemaining(timeLimitSeconds);
        });
    };

    initializeUpload(assignmentData.id, assignmentData.secret).then(
      (jsonResponse) => {
        uploadData.current.uploadId = jsonResponse.uploadId;
        uploadData.current.parts = [];
        uploadData.current.promises = [];
        uploadData.current.blobBuffer = [];
        uploadData.current.maxPartNumber = jsonResponse.partNumber;
        uploadData.current.uploadUrls = [
          {
            partNumber: jsonResponse.partNumber,
            signedUrl: jsonResponse.signedUrl,
          },
        ];
        uploadData.current.startTimestamp = Date.now();

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

        setRecording(true);
        mediaRecorderRef.current.start(RECORDER_TIME_SLICE);
      },
    );
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
              audioStreamTrackRef={audioStreamTrackRef}
            />
          )}
        </div>

        <div className="order-3 md:order-2 md:mx-2">{description}</div>

        {/* Controls */}
        <div className="order-2 md:order-3 py-2 md:col-span-2">
          {hasRecorded ? (
            <div className="flex place-content-between justify-items-center">
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
    </div>
  );
};

export default SubmitRecord;
