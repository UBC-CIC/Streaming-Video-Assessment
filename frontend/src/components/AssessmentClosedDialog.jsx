function AssessmentClosedDialog({ dialogRef, onContinueHandler }) {
  return (
    <dialog id="assessment-closed-dialog" className="modal" ref={dialogRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center mb-5">
          Assessment Closed!
        </h3>
        <p className="mb-10">
          In order to make changes to the assessment, you will need to reopen
          the assessment or update the due date while editing.
        </p>
        <div className="flex flex-row justify-end">
          <div className="mr-2">
            <button
              className="btn bg-red-500 btn-md text-white hover:text-black pl-4 pr-4"
              onClick={() => dialogRef.current.close()}
            >
              Go Back
            </button>
          </div>
          <div>
            <button
              className="btn bg-indigo-500 btn-md text-white hover:text-black"
              id="edit-assessment"
              onClick={onContinueHandler}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default AssessmentClosedDialog;