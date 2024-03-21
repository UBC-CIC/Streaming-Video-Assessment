import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFolder } from "../../helpers/submissionCreatorApi";

function CreateFolderDialog({ folderId }) {
  const navigate = useNavigate();
  const [folderName, setFolderName] = useState("");

  return (
    <dialog id="folder-modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="justify-center text-indigo-500 text-center font-bold text-xl uppercase self-center mt-2">
          Create New Folder
        </h3>
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
