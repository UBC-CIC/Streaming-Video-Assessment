// TODO: CLEAN UP THIS FILE and CODE
import { useEffect, useState } from "react";
import ReactPropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { createAssessment } from "../helpers/submissionCreatorApi";

// TODO: add error handling for all input types

function CreateAndEditSubmission({ edit = false }) {
  const { submissionData, folderId } = useLocation().state || {};
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState({ hours: 0, minutes: 0 });
  const [allowFaceBlur, setAllowFaceBlur] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  // TODO: figure out how to get this list and how to deal with individuals and groups
  const [sharedWithList, setSharedWithList] = useState([]);
  const [uploaders, setUploaders] = useState([]);
  const [groups, setGroups] = useState([]);
  const [email, setEmail] = useState("");
  const [usersName, setUsersName] = useState("");

  useEffect(() => {
    // Check the checkbox if its value matches the value to check against
    if (edit) {
      setName(submissionData.name);
      setDescription(submissionData.description);
      const hours = Math.floor(submissionData.timeLimitSeconds / 3600);
      const remainingSeconds = submissionData.timeLimitSeconds % 3600;
      const minutes = Math.floor(remainingSeconds / 60);
      setTimeLimit({
        hours: hours,
        minutes: minutes,
      });
      setAllowFaceBlur(submissionData.allowFaceBlur);
      setDueDate(submissionData.dueDate);
      setSharedWithList(
        submissionData.submissions.map((submission) => ({
          name: submission.name,
          email: submission.email,
        })),
      );
    }
  }, [submissionData]); // Re-run effect when valueToCheck changes

  const removeSharedWithUser = (index) => {
    // TODO: need to figure otu handling of group and individuals here
    const newSharedWithList = [...sharedWithList]; // Create a copy of the original array
    newSharedWithList.splice(index, 1);
    setSharedWithList(newSharedWithList);
  };

  const addToSharedList = () => {
    const newSharedWithList = [...sharedWithList];
    const newUploaders = [...uploaders];
    newSharedWithList.push({
      name: usersName,
      email: email,
      type: "individual",
    });
    setSharedWithList(newSharedWithList);
    newUploaders.push({ name: usersName, email: email });
    setUploaders(newUploaders);
    setUsersName("");
    setEmail("");
  };

  const assessmentHandler = async () => {
    if (edit) {
      // TODO: add functionality to edit assessment
      console.log("handling editing of assessment");
    } else {
      // need folderId, name, description, timeLimit, allowFaceBlur, dueDate, sharedUploaders, sharedGroups
      const data = {
        folderId: folderId,
        name: name,
        description: description,
        timeLimitSeconds: timeLimit.hours * 3600 + timeLimit.minutes * 60,
        faceBlurAllowed: allowFaceBlur,
        dueDate: dueDate,
        sharedUploaders: uploaders,
        sharedGroups: groups,
      };

      const message = await createAssessment(data);
      if (message.success) {
        alert("Assessment created successfully");
        // TODO: figure out where to navigate to
        navigate("/");
      } else {
        alert("Assessment creation failed");
      }
    }
  };

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
                value={usersName}
                onChange={(e) => setUsersName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                className="input input-bordered w-full max-w-md border-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div></div>
              <button className="btn btn-sm self-end" onClick={addToSharedList}>
                Add
              </button>
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
            {sharedWithList.map((sharedWith, index) => (
              <div className="grid grid-rows-1 gap-2 grid-flow-col w-full mt-4">
                <div className="font-bold">{sharedWith.name}</div>
                <div className="divider divider-horizontal divider-neutral"></div>
                <div className="font-bold">{sharedWith.email}</div>
                <div
                  className="btn btn-sm"
                  onClick={() => {
                    removeSharedWithUser(index);
                  }}
                >
                  x
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-10">
        <button
          className="btn bg-indigo-500 btn-lg text-white hover:text-black"
          onClick={assessmentHandler}
        >
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
