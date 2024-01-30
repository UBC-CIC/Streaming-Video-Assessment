import PropTypes from "prop-types";
import { GoPencil } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import FolderIcon from "../assets/icons/FolderIcon";
import UploadIcon from "../assets/icons/UploadIcon";
import GroupIcon from "../assets/icons/GroupIcon";

function ListViewRow({ index, row }) {
  const getIcon = (type) => {
    switch (type) {
      case "folder":
        return <FolderIcon width={"2em"} height={"2em"} />;
      case "group":
        return <GroupIcon width={"2em"} height={"2em"} />;
      case "submission":
        return <UploadIcon width={"2em"} height={"2em"} />;
      default:
        return <></>;
    }
  };

  const icon = getIcon(row.type);

  return (
    // TODO: figure out onclick of rows and icons
    <tr
      key={index}
      className="bg-white text-stone-500 hover:bg-gray-100"
      onClick={() => {
        console.log("TESTING");
      }}
    >
      <td className="p-2">{icon}</td>
      <td className="p-2">{row.name}</td>
      <td className="p-2">{row.dueDate}</td>
      <td className="p-2">{row.dateModified}</td>
      <td className="p-2">{row.dateCreated}</td>
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
  );
}

ListViewRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
};

export default ListViewRow;
