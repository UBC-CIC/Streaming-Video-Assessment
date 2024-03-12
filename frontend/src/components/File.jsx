import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FolderIcon from "../assets/icons/FolderIcon";
import GroupIcon from "../assets/icons/GroupIcon";
import UploadIcon from "../assets/icons/UploadIcon";
import GroupDialog from "./dialogs/GroupDialog";
import { useDrag, useDrop } from "react-dnd";
import { BsThreeDots } from "react-icons/bs";

function File({ file }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
        return () => {
          navigate(`/folder/${file.id}`);
        };
      case "group":
        return async () => {
          setIsOpen(true);
          document.getElementById("edit-group-modal").showModal();
        };
      case "assessment":
        return () => {
          navigate(`/submission/${file.id}`);
        };
      default:
        return () => {};
    }
  };

  const icon = getIcon();
  const onClickHandler = getOnClickFunction();
  const moveHandler = () => {
    const elem = document.activeElement;
    if (elem) {
      elem?.blur();
    }
    console.log("move");
  };
  const renameHandler = () => {
    const elem = document.activeElement;
    if (elem) {
      elem?.blur();
    }
    console.log("rename");
  };
  const deleteHandler = () => {
    const elem = document.activeElement;
    if (elem) {
      elem?.blur();
    }
    console.log("delete");
  };

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: file.type != "folder" ? [] : ["group", "folder", "assessment"],
      drop: () => ({
        name: file.name,
        allowedDropEffect: "folder",
      }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    ["folder"],
  );

  const [{ opacity }, drag] = useDrag(
    () => ({
      type: file.type,
      item: { name: file.name },
      end(item, monitor) {
        // TODO: add logic for moving files
        const dropResult = monitor.getDropResult();
        if (item && dropResult) {
          let alertMessage = "";
          if (
            dropResult.allowedDropEffect === "folder" &&
            dropResult.name !== file.name
          ) {
            // const isCopyAction = dropResult.dropEffect === "copy";
            // const actionName = isCopyAction ? "copied" : "moved";
            // alertMessage = `You ${actionName} ${item.name} into ${dropResult.name}!`;
            // alert(alertMessage);
            console.log("dropped into folder");
          } else if (dropResult.allowedDropEffect === "folderPath") {
            console.log("dropped into folder path");
          }
        }
      },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [file.name],
  );

  const isActive = canDrop && isOver;
  const selectBackgroundColor = () => {
    if (isActive && opacity === 1) {
      return "darkgreen";
    }
  };
  const backgroundColor = selectBackgroundColor();

  return (
    <div ref={drop} className="pt-3">
      <div
        ref={drag}
        className="w-full rounded-3xl max-w-sm bg-gray-300 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
        style={{ backgroundColor, opacity }}
      >
        <div className="dropdown dropdown-bottom dropdown-end flex justify-end px-2 pt-1">
          <button
            id="dropdownButton"
            data-dropdown-toggle="dropdown"
            className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
            type="button"
          >
            <BsThreeDots size={22} />
          </button>
          <ul
            tabIndex="0"
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
          >
            <li onClick={moveHandler}>
              <a>Move</a>
            </li>
            <li onClick={renameHandler}>
              <a>Rename</a>
            </li>
            <li onClick={deleteHandler}>
              <a className="text-rose-600">Delete</a>
            </li>
          </ul>
        </div>
        <div
          className="flex flex-col items-center pb-5 cursor-pointer"
          onClick={onClickHandler}
        >
          {icon}
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white truncate w-[95%] text-center">
            {file.name}
          </h5>
        </div>
      </div>
      {file.type === "group" && (
        <GroupDialog
          isEdit={true}
          groupId={file.id}
          parentId={file.folderId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}

File.propTypes = {
  file: PropTypes.object.isRequired,
};

export default File;
