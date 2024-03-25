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
        <div className="pl-5 flex items-center">
          <span className="mr-2 text-nowrap">Face Blur</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              disabled={!modelsLoaded}
              onChange={(e) => setBlurface(e.target.checked)}
              checked={blurface}
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      )}
    </div>
  );
};

export default SubmitRecordControls;
