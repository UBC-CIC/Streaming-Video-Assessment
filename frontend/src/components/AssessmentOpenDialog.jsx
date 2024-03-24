function AssessmentOpenDialog({ isPassDueDate }) {
  return (
    <dialog id="assessment-open-dialog" className="modal">
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
              <input id="open-due-date" type="datetime-local" />
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
                if (isPassDueDate)
                  document.getElementById("open-due-date").value = null;
                document.getElementById("assessment-open-dialog").close();
              }}
            >
              Go Back
            </button>
          </div>
          <div>
            <button
              className="btn bg-indigo-500 btn-md text-white hover:text-black"
              id="open-assessment"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default AssessmentOpenDialog;
