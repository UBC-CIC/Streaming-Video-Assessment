import React, {useState} from 'react';
import Video from './Video';

const formatSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

const SubmitRecord = ({assignmentData}) => {
    
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
            <div class="flex flex-wrap place-content-between justify-items-center align-center py-2 order-2 md:col-span-2 md:order-3 max-w-lg">
                
                <div>
                {recording ?
                    <button 
                        class="button text-white text-center justify-center text-l font-black bg-red-500 hover:bg-red-400 self-center px-5 py-2 text-nowrap rounded-md"
                        onClick={() => {
                            setRecording(false);
                        }}
                        >Stop Recording</button>
                    :
                    <button 
                        class="button text-white text-center justify-center text-l font-black bg-green-500 hover:bg-green-400 self-center px-5 py-2 text-nowrap rounded-md"
                        onClick={() => {
                            setRecording(true);
                        }}
                        >Start Recording</button>
                }
                </div>
                
                
                <div class="flex flex-wrap self-center justify-center items-center p-2">
                    <span class="mr-1">Time left:</span> 
                    <span>{formatSeconds(secondsRemaining)}</span>
                </div>

                {allowFaceBlur && 
                <div>
                    <label class="flex items-center justify-center flex-wrap p-2 cursor-pointer">
                        <span class="mr-2 text-nowrap">Face Blur</span>
                        <div class="relative inline-flex items-center">
                            <input
                                type="checkbox"
                                // value=""
                                class="sr-only peer"
                                checked={blurface}
                                onChange={(e) => setBlurface(e.target.checked)}
                            />
                            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </div>
                    </label>
                </div>
                }
            </div>
        </div>
    );
};

export default SubmitRecord;
