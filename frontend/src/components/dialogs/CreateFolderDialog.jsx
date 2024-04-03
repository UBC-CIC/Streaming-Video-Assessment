import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFolder } from "../../helpers/submissionCreatorApi";
import { IoIosInformationCircleOutline } from "react-icons/io";

function CreateFolderDialog({ dialogRef, folderId }) {
  const navigate = useNavigate();
  const [folderName, setFolderName] = useState("");

  return (
    <dialog id="folder-modal" className="modal" ref={dialogRef}>
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex justify-center items-center mt-2">
            <h3 className="justify-center text-indigo-500 text-center font-bold text-xl uppercase self-center mt-2 pr-2">
              Create Folder
            </h3>
            <div
              className="tooltip tooltip-bottom tooltip-lg"
              data-tip={`Folders can be used to store assessments, groups, and other folders.`}>
              <IoIosInformationCircleOutline size={20} />
            </div>
          </div>
        <div className="flex justify-center mt-5">
          <input
            type="text"
            placeholder="Folder Name"
            className="input input-bordered w-full max-w-sm border-black"
            onChange={(e) => setFolderName(e.target.value)}
          />
        </div>
        <div className="modal-action flex justify-center">
          <form method="dialog">
            <button
              className="btn w-44 text-white bg-indigo-500 btn-lg"
              onClick={async () => {
                await createFolder(folderName, folderId);
                setFolderName(null);
                navigate(0);
              }}
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default CreateFolderDialog;
