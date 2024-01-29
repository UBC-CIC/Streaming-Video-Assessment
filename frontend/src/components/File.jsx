import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import FolderIcon from "../assets/icons/FolderIcon";
import UploadIcon from "../assets/icons/UploadIcon";
import GroupIcon from "../assets/icons/GroupIcon";
import GroupDialog from "./dialogs/GroupDialog";

function File({ file }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const getIcon = () => {
    switch (file.type) {
      case "folder":
        return <FolderIcon width={"141"} height={"131"} />;
      case "group":
        return <GroupIcon width={"130"} height={"131"} />;
      case "submission":
        return <UploadIcon width={"130"} height={"131"} />;
      default:
        return <></>;
    }
  };

  const getOnClickFunction = () => {
    switch (file.type) {
      case "folder":
        return () => {
          navigate(`/folder/${file.id}`);
        };
      case "group":
        return async () => {
          setIsOpen(true);
          document.getElementById("edit-group-modal").showModal();
        };
      case "submission":
        return () => {
          navigate(`/submission/${file.id}`);
        };
      default:
        return () => {};
    }
  };

  const icon = getIcon();
  const onClickHandler = getOnClickFunction();

  return (
    <>
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={onClickHandler}
      >
        <div className="bg-zinc-300 flex flex-col w-full mt-1.5 pt-7 px-18 rounded-[40px] items-center">
          <div className="justify-center text-black text-center text-xl truncate w-[75%]">
            {file.name}
          </div>
          {icon}
        </div>
      </div>
      {file.type === "group" && (
        <GroupDialog
          isEdit={true}
          groupId={file.id}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
}

File.propTypes = {
  file: PropTypes.object.isRequired,
};

export default File;
