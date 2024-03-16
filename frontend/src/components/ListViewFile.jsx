import PropTypes from "prop-types";
import { GoPencil } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import FolderIcon from "../assets/icons/FolderIcon";
import UploadIcon from "../assets/icons/UploadIcon";
import GroupIcon from "../assets/icons/GroupIcon";

import { useNavigate } from "react-router-dom";

import { useDrag, useDrop } from "react-dnd";
import { moveFile } from "../helpers/submissionCreatorApi";

function ListViewFile({ index, file, removeFile }) {
  const navigate = useNavigate();

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
        className="bg-white text-stone-500 hover:bg-gray-100"
        onClick={getOnClickFunction()}
        style={{ backgroundColor, opacity }}
      >
        <td className="p-2">{icon}</td>
        <td className="p-2">{file.name}</td>
        <td className="p-2">{file.dueDate}</td>
        <td className="p-2">{file.dateModified}</td>
        <td className="p-2">{file.dateCreated}</td>
        <td
          className="p-2"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Edit");
          }}
        >
          <GoPencil className="text-stone-500 hover:text-stone-700 cursor-pointer" />
        </td>
        <td
          className="p-2"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Trash");
          }}
        >
          <FaTrash className="text-stone-500 hover:text-stone-700 cursor-pointer" />
        </td>
      </tr>
    </tbody>
  );
}

ListViewFile.propTypes = {
  index: PropTypes.number.isRequired,
  file: PropTypes.object.isRequired,
};

export default ListViewFile;
