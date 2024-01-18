import React, {useState} from 'react';
import Video from './Video';
import SubmitRecordControls from './SubmitRecordControls';

const SubmitRecord = ({assignmentData, confirmSubmission}) => {
    
    const {timeLimitMinutes, description, allowFaceBlur} = assignmentData;

    const [secondsRemaining, setSecondsRemaining] = useState(timeLimitMinutes*60);
    const [blurface, setBlurface] = useState(false);

    const [recording, setRecording] = useState(false);
    const [hasRecorded, setHasRecorded] = useState(false);

    return (
        <div class="grid grid-cols-1 m-5 md:grid-cols-3">

            {/* TODO: set max height on video to not push controls off the page */}
            <div class="w-full h-full border order-1 md:col-span-2">
            {
                hasRecorded && !recording ?
                <video />
                :
                <Video  blurface={blurface} />
            }
            </div>
            

            <div class="order-3 md:order-2 md:mx-2">
                {description}
            </div>

            {/* Controls */}

            {
                !recording && hasRecorded ?
                <div class="order-4 md:order-3">
                    <button class="button text-white text-center justify-center text-l font-black bg-green-500 hover:bg-green-400 self-center px-5 py-2 text-nowrap rounded-md"
                        onClick={() => {
                            setRecording(true);
                        }}
                    >Re-record</button>
                    <button class="button text-white text-center justify-center text-l font-black bg-indigo-500 hover:bg-indigo-400 self-center px-5 py-2 text-nowrap rounded-md"
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
    );
};

export default SubmitRecord;
