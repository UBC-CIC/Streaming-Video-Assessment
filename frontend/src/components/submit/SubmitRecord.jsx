import React, { useRef, useState } from "react";
import Video from "./Video";
import SubmitRecordControls from "./SubmitRecordControls";

const SubmitRecord = ({
  assignmentData,
  confirmSubmission,
  detectFaces,
  modelsLoaded,
}) => {
  const { timeLimitMinutes, description, allowFaceBlur, name } = assignmentData;

  const uploadedVideoRef = useRef(null);

  const [secondsRemaining, setSecondsRemaining] = useState(
    timeLimitMinutes * 60,
  );
  const [blurface, setBlurface] = useState(false);

  const [recording, setRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

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
              ref={uploadedVideoRef}
              controls
              // TODO: replace with actual video
              src="https://video-storage-sf21.s3.ca-central-1.amazonaws.com/video.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA4GFYK4NJRQOYLNXG%2F20240201%2Fca-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240201T220454Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDGNhLWNlbnRyYWwtMSJGMEQCIERlONGk7lgCWSNdqOTQ0cF7eOw2sIqMS0wx%2B3Cmo5haAiAoG2rkrWRmbxB4vO2US0N4zQRYA%2F9PHx7fhKQ0B3%2BXdyrWBAhPEAAaDDgzNzkwNTIxMjI0MyIM24YX%2BJXVJM72cedAKrME5tpnLfEA5ALW78iZ3AF%2BgQ8kkxJGPHOo6uXO3SREIE6AdfcVxIhsqHWgrPNaYgwOsqmEB4KtD1JUdpej0OhRcRU%2Fm35bwIc6speDqnNke9YHMM4%2BHjxj4EicaR7n9umE04wyGmCaftcqzC0%2FfbTf%2BG55nxvRV01GaVInBKOLb7Xr1%2F8DsdGBVaEvrKq%2F1sPyEnB5%2FUiJZq9S3XjHoczf4m%2FXhCgMqoHxHGdh0pXHUS%2BCdqqzjIeqBSLHvxB1YXfU%2FLetuegjXV%2BuItND3%2BL6siEpquN865IF%2FD8xrXwTjbsPjuQEBMRQE%2FQNBKdJDg1cxVo2L%2BBhDPbryfdW9ol7eu0UWoOqkJxReY3uzsN%2B69e1CZ7VTQj3xDlYpOGeYw%2FoJx0OwkMMM9ogDr%2F9%2FWuJsRE7LPn3EnwpaLibp7iACE0IqRMclEnhyz0af0BU4gAs68RvNJzoC4W5gYKEvjUwUshBBYfqJ%2BXZEZi5RgI42NG5BselpTynt9pU2UnnpG4%2BImx1XdwAD55uS%2F%2FKrazcMFp85KCcHqA1K11PqpoCAGnn0rA1Cdse6Hhfveg6rzo3kboH6MgZ%2FsZXi6%2BSL%2FtJAppGMedO%2F2GDTJXDHrTyhaSHFuf98Jcm2Ph%2Be0ZUyspzby50A%2BRf3wK3SgDk909MXMMHdCugePdTleC4NeR91P8RcmBaIcIGlYmGbqa3O%2BUL2A9WF1DCYib7fmZcfiZVfkRdDTbE6SrFbTThU2YvCrr5D1kwhavwrQY6hgLDGbRfQS8JU2sXJMlL0pNvGPNXXi%2BGuJUmEnbok%2BWX8TKTu1EyQVq25GpBLcOQRJHPd55FqQdKuAiRC06BOhSviMakbJUrdOTqAQG7yrhT0ubImuiM5lvAvg0Kw4qfBOCbfGcRoYNzypFxBavSQ%2Bf5WYVeCVZ1S26C65%2BYlco%2Bi5qqaZHuagqJv6mM8D6azMc0PxvsOWWBpwDtuNkmA4jQnh8sE6lvSz7QhBDnX7QUpBSW11HOM8vJ8MwyUnPGuxBiPfrgdNt%2F6v%2FNtLHOhO9nkVlRQvCDnsD%2By64As6JcespvrKLucOnC8ghnniIH2mi3XftstX0f3r7n5mzAqyyH%2B%2FZ0r191&X-Amz-Signature=ba20858fe71ca9689a53fc6cd88ce83429a0fa2395b96a2302453618bd9205c0&X-Amz-SignedHeaders=host&x-id=GetObject"
            ></video>
          ) : (
            <Video
              blurface={blurface}
              detectFaces={detectFaces}
              modelsLoaded={modelsLoaded}
            />
          )}
        </div>

        <div className="order-3 md:order-2 md:mx-2">{description}</div>

        {/* Controls */}

        {!recording && hasRecorded ? (
          <div className="order-4 md:order-3">
            <button
              className="button text-white text-center justify-center text-l font-black bg-green-500 hover:bg-green-400 self-center px-5 py-2 text-nowrap rounded-md"
              onClick={() => {
                setRecording(true);
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
            setRecording={setRecording}
            setHasRecorded={setHasRecorded}
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
