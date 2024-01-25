import React, {useState} from 'react';
import Video from './Video';
import SubmitRecordControls from './SubmitRecordControls';

const SubmitRecord = ({assignmentData, confirmSubmission}) => {
    
    const {timeLimitMinutes, description, allowFaceBlur, name} = assignmentData;

    const [secondsRemaining, setSecondsRemaining] = useState(timeLimitMinutes*60);
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
                {
                    hasRecorded && !recording ?
                    <video />
                    :
                    <Video  blurface={blurface} />
                }
                </div>
                

                <div className="order-3 md:order-2 md:mx-2">
                    {description}
                </div>

                {/* Controls */}

                {
                    !recording && hasRecorded ?
                    <div className="order-4 md:order-3">
                        <button className="button text-white text-center justify-center text-l font-black bg-green-500 hover:bg-green-400 self-center px-5 py-2 text-nowrap rounded-md"
                            onClick={() => {
                                setRecording(true);
                            }}
                        >Re-record</button>
                        <button className="button text-white text-center justify-center text-l font-black bg-indigo-500 hover:bg-indigo-400 self-center px-5 py-2 text-nowrap rounded-md"
                            onClick={() => {
                                confirmSubmission();
                            }}
                        >Submit</button>
                    </div>
                    :
                    <SubmitRecordControls 
                    recording={recording} setRecording={setRecording}  setHasRecorded={setHasRecorded}
                    secondsRemaining={secondsRemaining} allowFaceBlur={allowFaceBlur} blurface={blurface} setBlurface={setBlurface}
                    />
                }
                
            </div>
        </div>
    );
};

export default SubmitRecord;
