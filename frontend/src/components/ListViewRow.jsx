import PropTypes from "prop-types";
import { GoPencil } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import FolderIcon from "../assets/icons/FolderIcon";
import UploadIcon from "../assets/icons/UploadIcon";
import GroupIcon from "../assets/icons/GroupIcon";

function getIcon(type) {
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
}

function ListViewRow({ index, row }) {
  const icon = getIcon(row.type);
  return (
    <tr key={index} className="bg-white text-stone-500 hover:bg-gray-100">
      <td
        className="p-2"
        onClick={() => {
          console.log("Selected");
        }}
      >
        {icon}
      </td>
      <td
        className="p-2"
        onClick={() => {
          console.log("Selected");
        }}
      >
        {row.name}
      </td>
      <td
        className="p-2"
        onClick={() => {
          console.log("Selected");
        }}
      >
        {row.dueDate}
      </td>
      <td
        className="p-2"
        onClick={() => {
          console.log("Selected");
        }}
      >
        {row.dateModified}
      </td>
      <td
        className="p-2"
        onClick={() => {
          console.log("Selected");
        }}
      >
        {row.dateCreated}
      </td>
      <td
        className="p-2"
        onClick={() => {
          console.log("Edit");
        }}
      >
        <GoPencil className="text-stone-500 hover:text-stone-600" />
      </td>
      <td
        className="p-2"
        onClick={() => {
          console.log("Trash");
        }}
      >
        <FaTrash className="text-stone-500 hover:text-stone-600" />
      </td>
    </tr>
  );
}

ListViewRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
};

export default ListViewRow;
