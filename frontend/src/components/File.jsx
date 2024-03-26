import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIcon } from "../helpers/getIcon";
import GroupDialog from "./dialogs/GroupDialog";
import { useDrag, useDrop } from "react-dnd";
import { BsThreeDots } from "react-icons/bs";
import { moveFile } from "../helpers/submissionCreatorApi";

function File({ file, removeFile }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const editGroupModalRef = useRef(null);

  const getOnClickFunction = () => {
    switch (file.type) {
      case "folder":
        return () => {
          navigate(`/folder/${file.id}`);
        };
      case "group":
        return () => {
          setIsOpen(true);
          console.log(editGroupModalRef);
          editGroupModalRef.current.showModal();
        };
      case "assessment":
        return () => {
          navigate(`/submission/${file.id}`);
        };
      default:
        return () => {};
    }
  };

  const icon = getIcon(file);
  const onClickHandler = getOnClickFunction();

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

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: file.type != "folder" ? [] : ["group", "folder", "assessment"],
    drop: () => ({
      file,
      allowedDropEffect: "folder",
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [{ opacity }, drag] = useDrag(
    () => ({
      type: file.type,
      item: { file },
      end(item, monitor) {
        const dropResult = monitor.getDropResult();

        if (!item || !dropResult) return;

        if (
          item.file.type !== "folder" ||
          dropResult.file.id !== item.file.id
        ) {
          moveFile(item.file, dropResult.file).then(() => {
            removeFile(item.file);
          });
        }
      },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [file],
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
          <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
            {/* <li onClick={moveHandler}>
              <a>Move</a>
            </li> */}
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
          dialogRef={editGroupModalRef}
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
