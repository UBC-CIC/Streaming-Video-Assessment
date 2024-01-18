import React from 'react';

const formatSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

const SubmitRecordControls = ({ recording, setRecording, setHasRecorded, secondsRemaining, allowFaceBlur, blurface, setBlurface }) => {
    return (
        <div className="flex flex-wrap place-content-between justify-items-center align-center py-2 order-2 md:col-span-2 md:order-3 max-w-lg">
            <div>
                {recording ?
                    <button
                        className="button text-white text-center justify-center text-l font-black bg-red-500 hover:bg-red-400 self-center px-5 py-2 text-nowrap rounded-md"
                        onClick={() => {
                            setRecording(false);
                            setHasRecorded(true);
                        }}
                    >Stop Recording</button>
                    :
                    <button
                        className="button text-white text-center justify-center text-l font-black bg-green-500 hover:bg-green-400 self-center px-5 py-2 text-nowrap rounded-md"
                        onClick={() => {
                            setRecording(true);
                        }}
                    >Start Recording</button>
                }
            </div>

            <div className="flex flex-wrap self-center justify-center items-center p-2">
                <span className="mr-1">Time left:</span>
                <span>{formatSeconds(secondsRemaining)}</span>
            </div>

            {allowFaceBlur &&
                <div>
                    <label className="flex items-center justify-center flex-wrap p-2 cursor-pointer">
                        <span className="mr-2 text-nowrap">Face Blur</span>
                        <div className="relative inline-flex items-center">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={blurface}
                                onChange={(e) => setBlurface(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </div>
                    </label>
                </div>
            }
        </div>
    );
};

export default SubmitRecordControls;