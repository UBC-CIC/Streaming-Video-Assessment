import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { GoPencil } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import FolderIcon from "../assets/icons/FolderIcon";
import UploadIcon from "../assets/icons/UploadIcon";
import GroupIcon from "../assets/icons/GroupIcon";

import GroupDialog from "./dialogs/GroupDialog";

import { useNavigate } from "react-router-dom";

import { useDrag, useDrop } from "react-dnd";
import {
  moveFile,
  deleteFolder,
  deleteAssessment,
  deleteGroup,
} from "../helpers/submissionCreatorApi";

function ListViewFile({ index, file, removeFile, fetchFolderData }) {
  const navigate = useNavigate();
  const editGroupModalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case "folder":
        return <FolderIcon width={"2em"} height={"2em"} />;
      case "group":
        return <GroupIcon width={"2em"} height={"2em"} />;
      case "assessment":
        return <UploadIcon width={"2em"} height={"2em"} />;
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
        return () => {
          setIsOpen(true);
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

  const deleteHandler = async () => {
    setIsDeleting(true);
    // TODO: give a confirmation dialog
    try {
      switch (file.type) {
        case "folder":
          await deleteFolder(file.id);
          break;
        case "group":
          await deleteGroup(file.id);
          break;
        case "assessment":
          await deleteAssessment(file.id);
          break;
      }

      removeFile(file);
      console.log("delete", file);
    } catch (error) {
      setIsDeleting(false);
      console.error("Error deleting file", error);
    }
  };

  const icon = getIcon(file.type);

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

  const formatDate = (date) => {
    if (!date) return;

    const d = new Date(date);
    const now = new Date();
    const diff = now - d;

    if (diff < 0) {
      return d.toLocaleString();
    }

    if (diff < 1000 * 60) {
      return "Just now";
    }

    if (diff < 1000 * 60 * 60) {
      return `${Math.floor(diff / (1000 * 60))} minutes ago`;
    }

    if (diff < 1000 * 60 * 60 * 24) {
      return `${Math.floor(diff / (1000 * 60 * 60))} hours ago`;
    }

    return d.toLocaleString();
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

  const backgroundColor =
    canDrop && isOver && opacity === 1 ? "darkgreen" : null;

  return (
    <tbody ref={drop}>
      <tr
        key={index}
        ref={drag}
        className="bg-white text-stone-500 hover:bg-gray-100 cursor-pointer"
        onClick={getOnClickFunction()}
        style={{ backgroundColor, opacity }}
      >
        <td className="p-2 w-[1%] whitespace-nowrap">{icon}</td>
        <td className="p-2">{file.name}</td>
        <td className="p-2 max-sm:hidden">{formatDate(file.dueDate)}</td>
        <td className="p-2 max-md:hidden">{formatDate(file.updatedAt)}</td>
        <td className="p-2 max-md:hidden">{formatDate(file.createdAt)}</td>
        <td
          className="p-2"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Edit");
          }}
        >
          <GoPencil className="text-stone-500 hover:text-stone-700" />
        </td>
        <td
          className="p-2"
          onClick={(e) => {
            e.stopPropagation();
            deleteHandler();
          }}
        >
          {isDeleting ? <span className="loading loading-spinner loading-xs"></span> : <FaTrash className="text-stone-500 hover:text-stone-700" />}
        </td>
      </tr>
      {file.type === "group" && (
        <GroupDialog
          dialogRef={editGroupModalRef}
          isEdit={true}
          groupId={file.id}
          parentId={file.folderId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          fetchFolderData={fetchFolderData}
        />
      )}
    </tbody>
  );
}

ListViewFile.propTypes = {
  index: PropTypes.number.isRequired,
  file: PropTypes.object.isRequired,
};

export default ListViewFile;
