import React from 'react';

const SubmitDetails = ({assignmentData, begin}) => {

    const {name, description, dueDate, timeLimitMinutes, completedOn} = assignmentData;

    return (
    <div className="grid grid-cols-1 place-items-center min-h-dvh py-5 max-md:px-5">
      <div className="self-start flex w-[770px] max-w-full flex-col my-2 max-md:my-10">
        <span className="text-black text-6xl self-center max-md:max-w-full max-md:text-4xl">
          {name}
        </span>
        <div className="bg-black self-stretch mt-1 shrink-0 h-0.5 max-md:max-w-full" />
        <span className="text-black text-m mt-2 max-md:max-w-full">
          Complete By: {dueDate}
        </span>
        <span className="text-black text-m mt-2 max-md:max-w-full">
          Time Limit: {timeLimitMinutes} minutes
        </span>
        <div className="text-black text-m bg-zinc-200 mt-2 p-2 max-md:max-w-full max-md:pr-5">
          {description}
        </div>
      </div>

        
        <div className="self-end flex justify-center mb-5 mt-5 w-full max-md:w-full">
            {completedOn ?
            <span className="text-black text-2xl self-center max-md:max-w-full max-md:text-l">
            Completed on: {completedOn}
            </span>
            :
            <button 
                onClick={begin}
                className="button text-white text-center text-l font-black uppercase bg-indigo-500 hover:bg-indigo-400 self-center px-10 py-5 rounded-md"
                >
                Begin
            </button>
            }
        </div>
    </div>
    );
};

export default SubmitDetails;

