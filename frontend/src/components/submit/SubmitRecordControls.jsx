import React from "react";

const formatSeconds = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const SubmitRecordControls = ({
  recording,
  setIntentRecording,
  intentRecording,
  secondsRemaining,
  allowFaceBlur,
  blurface,
  setBlurface,
  modelsLoaded,
}) => {
  return (
    <div className="flex flex-wrap place-content-between justify-items-center align-center">
      <div>
        {recording ? (
          <button
            className="button text-white text-center justify-center text-l font-black bg-red-500 hover:bg-red-400 self-center px-5 py-2 text-nowrap rounded-md"
            onClick={() => {
              setIntentRecording(false);
            }}
            disabled={!intentRecording}
          >
            Stop Recording
          </button>
        ) : (
          <button
            className="button text-white text-center justify-center text-l font-black bg-green-500 hover:bg-green-400 self-center px-5 py-2 text-nowrap rounded-md"
            onClick={() => {
              setIntentRecording(true);
            }}
            disabled={intentRecording}
          >
            Start Recording
          </button>
        )}
      </div>
      <div className="flex flex-wrap self-center justify-center items-center p-2">
        <span className="mr-1">Time left:</span>
        <span>{formatSeconds(secondsRemaining)}</span>
      </div>
      {allowFaceBlur && (
        <label className="flex items-center justify-center flex-wrap p-2 cursor-pointer">
          <span className="mr-2 text-nowrap">Face Blur</span>
          <input
            type="checkbox"
            className="toggle toggle-info"
            disabled={!modelsLoaded}
            onChange={(e) => setBlurface(e.target.checked)}
            checked={blurface}
          />
        </label>
      )}
    </div>
  );
};

export default SubmitRecordControls;
