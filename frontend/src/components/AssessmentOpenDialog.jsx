import { useState } from "react";

function AssessmentOpenDialog({ dialogRef, onContinueHandler, isPassDueDate }) {
  const [dueDate, setDueDate] = useState(null);

  return (
    <dialog id="assessment-open-dialog" className="modal" ref={dialogRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center mb-5">
          Reopening Assessment
        </h3>
        {isPassDueDate ? (
          <>
            <p className="mb-2 text-lg">
              Change Due Date to new value and the submission will stay open
              till then:
            </p>
            <div className="justify-center flex pb-10">
              <input
                id="open-due-date"
                type="datetime-local"
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </>
        ) : (
          <p className="mb-10">
            Submission will stay open until the due date If you want to change
            the due date please edit the assessment.
          </p>
        )}
        <div className="flex flex-row justify-end">
          <div className="mr-2">
            <button
              className="btn bg-red-500 btn-md text-white hover:text-black pl-4 pr-4"
              onClick={() => {
                if (isPassDueDate) setDueDate(null);
                dialogRef.current.close();
              }}
            >
              Go Back
            </button>
          </div>
          <div>
            <button
              className="btn bg-indigo-500 btn-md text-white hover:text-black"
              id="open-assessment"
              onClick={() => onContinueHandler(dueDate)}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default AssessmentOpenDialog;
