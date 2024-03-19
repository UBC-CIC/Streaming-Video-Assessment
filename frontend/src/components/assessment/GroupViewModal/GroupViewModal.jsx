import { useState } from "react";
import { getGroups } from "../../../helpers/submissionCreatorApi";
import GroupView from "./GroupView";

function GroupViewModal({ addToSharedList }) {
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState();

  const fetchGroups = async (folderId) => {
    setIsLoading(true);
    const fetchedGroups = await getGroups(folderId);
    setFiles(fetchedGroups.content);
    setPath(fetchedGroups.path);
    setIsLoading(false);
  };

  const onViewModal = async () => {
    document.getElementById("groupView").showModal();
    await fetchGroups();
  };

  return (
    <div className="flex justify-center pb-2">
      <button className="btn btn-wide" onClick={onViewModal}>
        Select a Group
      </button>
      <dialog id="groupView" className="modal">
        <div className="modal-box max-w-none w-[70%] max-h-none h-[80%]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <GroupView
            isLoading={isLoading}
            files={files}
            path={path}
            fetchGroups={fetchGroups}
            addToSharedList={addToSharedList}
          />
        </div>
      </dialog>
    </div>
  );
}

export default GroupViewModal;
