import ReactPropTypes from "prop-types";
import { useLocation } from "react-router-dom";

function CreateAndEditSubmission({ edit = false }) {
  const { submissionData } = useLocation().state || {};

  return (
    <div className="flex flex-col m-10">
      <div className="flex flex-col w-full md:flex-row">
        <div className="md:w-[70%]">
          <div className="pb-1">
            <input
              type="text"
              placeholder="Submission Name"
              className="input w-full text-4xl"
            />
          </div>
          <div className="bg-black h-0.5" />
          <textarea
            className="textarea textarea-bordered w-full mt-5 textarea-lg h-[20rem]"
            placeholder="Description"
          ></textarea>
          <div className="pb-1 mt-5">
            <div className="text-4xl">Settings</div>
          </div>
          <div className="bg-black h-0.5" />
          <div className="flex flex-row mt-8 text-xl">
            Time Limit:
            <div className="flex flex-row pl-5 w-[30%]">
              <label htmlFor="hours" className="pr-2">
                Hours:
              </label>
              <input
                type="number"
                id="hours"
                name="hours"
                min="0"
                max="99"
                placeholder="Hours"
                className="w-full"
              />
            </div>
            <div className="flex flex-row pl-5 w-[30%]">
              <label htmlFor="minutes" className="pr-2">
                Minutes:
              </label>
              <input
                type="number"
                id="minutes"
                name="minutes"
                min="0"
                max="59"
                placeholder="Minutes"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-row text-xl w-full">
            Allow Face Blur:
            <div className="pl-5 flex items-center">
              <input
                type="checkbox"
                className="toggle toggle-lg toggle-success"
              />
            </div>
          </div>
          <div className="flex flex-row text-xl w-full">
            Close Submission On:
            <div className="pl-5 flex items-center">
              <input type="datetime-local" />
            </div>
          </div>
        </div>
        <div className="divider md:divider-horizontal"></div>
        <div className="flex flex-col justify-between items-center md:w-[30%] mt-[0.5rem]">
          <div className="w-full">
            <div className="text-4xl text-center pb-1">Sharing</div>
            <div className="bg-black h-0.5" />
            <div className="grid grid-rows-2 gap-2 grid-flow-col w-full mt-4">
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered w-full max-w-md border-black"
              />
              <input
                type="text"
                placeholder="Email"
                className="input input-bordered w-full max-w-md border-black"
              />
              <div></div>
              <button className="btn btn-sm self-end">Add</button>
            </div>
            <div className="divider">OR</div>
            <div className="flex justify-center">
              <button
                className="btn btn-wide"
                onClick={() =>
                  document.getElementById("my_modal_3").showModal()
                }
              >
                Select a Group
              </button>
              <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  {/* TODO: add selection for groups here */}
                </div>
              </dialog>
            </div>
            <div className="grid grid-rows-1 gap-2 grid-flow-col w-full mt-4">
              <div className="font-bold">Name</div>
              <div className="divider divider-horizontal divider-neutral"></div>
              <div className="font-bold">email</div>
              <div className="btn btn-sm">x</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-10">
        <button className="btn bg-indigo-500 btn-lg text-white hover:text-black">
          Create
        </button>
      </div>
    </div>
  );
}

CreateAndEditSubmission.propTypes = {
  edit: ReactPropTypes.bool,
};

export default CreateAndEditSubmission;
