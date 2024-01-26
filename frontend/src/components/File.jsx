import { useState } from "react";
import PropTypes from "prop-types";
import FolderIcon from "../assets/icons/FolderIcon";
import UploadIcon from "../assets/icons/UploadIcon";
import GroupIcon from "../assets/icons/GroupIcon";
import GroupDialog from "./dialogs/GroupDialog";

async function getGroupList(groupId) {
  return [
    { name: "John Doe", email: "test@gmail.com" },
    { name: "Jane Doe", email: "test2@gmail.com" },
    { name: "Billy Joel", email: "test3@gmail.com" },
    { name: "Bob Smith", email: "test4@gmail.com" },
  ];
}

function File({ file }) {
  const [isOpen, setIsOpen] = useState(false); // [{name: "", email: ""}

  const getIcon = () => {
    switch (file.type) {
      case "folder":
        return <FolderIcon width={"141"} height={"131"} />;
      case "group":
        return <GroupIcon width={"130"} height={"131"} />;
      case "assessment":
        return <UploadIcon width={"130"} height={"131"} />;
      default:
        return <></>;
    }
  };

  const getOnClickFunction = () => {
    switch (file.type) {
      case "folder":
        return () => {};
      case "group":
        return async () => {
          setIsOpen(true);
          document.getElementById("edit-group-modal").showModal();
        };
      case "assessment":
        return () => {};
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
