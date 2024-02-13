import { useEffect, useState } from "react";
import ReactPropTypes from "prop-types";
import { useLocation } from "react-router-dom";

// TODO: add error handling for timing and dates

function CreateAndEditSubmission({ edit = false }) {
  const { submissionData } = useLocation().state || {};
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState({ hours: 0, minutes: 0 });
  const [allowFaceBlur, setAllowFaceBlur] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  // TODO: figure out how to get this list and how to deal with individuals and groups
  const [sharedWithList, setSharedWithList] = useState([]);

  console.log(submissionData);

  useEffect(() => {
    // Check the checkbox if its value matches the value to check against
    if (edit) {
      setName(submissionData.name);
      setDescription(submissionData.description);
      setTimeLimit({
        hours: submissionData.timeLimit.hours,
        minutes: submissionData.timeLimit.minutes,
      });
      setAllowFaceBlur(submissionData.allowFaceBlur);
      setDueDate(submissionData.dueDate);
    }
  }, [submissionData]); // Re-run effect when valueToCheck changes

  return (
    <div className="flex flex-col m-10">
      <div className="flex flex-col w-full md:flex-row">
        <div className="md:w-[70%]">
          <div className="pb-1">
            <input
              type="text"
              placeholder="Submission Name"
              className="input w-full text-4xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="bg-black h-0.5" />
          <textarea
            className="textarea textarea-bordered w-full mt-5 textarea-lg h-[20rem]"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
                value={timeLimit.hours}
                onChange={(e) =>
                  setTimeLimit({ ...timeLimit, hours: e.target.value })
                }
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
                value={timeLimit.minutes}
                onChange={(e) =>
                  setTimeLimit({ ...timeLimit, minutes: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-row text-xl w-full">
            Allow Face Blur:
            <div className="pl-5 flex items-center">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  class="sr-only peer"
                  checked={allowFaceBlur}
                  onChange={() => setAllowFaceBlur(!allowFaceBlur)}
                />
                <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="flex flex-row text-xl w-full">
            Close Submission On:
            <div className="pl-5 flex items-center">
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
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
          {edit ? "Save" : "Create"}
        </button>
      </div>
    </div>
  );
}

CreateAndEditSubmission.propTypes = {
  edit: ReactPropTypes.bool,
};

export default CreateAndEditSubmission;
