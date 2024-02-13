import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useDrop } from "react-dnd";

function Crumb({ path, index, lastPath, allowedDropEffect = "any" }) {
  const navigate = useNavigate();

  const handlePathClick = (id) => {
    if (id === "HOME") {
      return navigate(`/home`);
    }

    return navigate(`/folder/${id}`);
  };

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: ["group", "folder", "submission"],
      drop: () => ({
        name: path.name,
        allowedDropEffect: "folderPath",
      }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    ["folderPath"],
  );

  const underline = canDrop && isOver ? "underline" : "";

  return lastPath ? (
    <li ref={drop} key={index}>
      <a
        style={
          underline
            ? { "text-decoration": "underline", "font-weight": "bold" }
            : {}
        }
        onClick={() => {
          handlePathClick(path.id);
        }}
      >
        {path.name}
      </a>
    </li>
  ) : (
    <li key={index}>{path.name}</li>
  );
}

function FolderPath({ folderPath = [] }) {
  return (
    <div className="text-md breadcrumbs">
      <ul>
        {folderPath.map((path, index) => (
          <Crumb
            path={path}
            index={index}
            lastPath={index !== folderPath.length - 1}
          />
        ))}
      </ul>
    </div>
  );
}

FolderPath.propTypes = {
  folderPath: PropTypes.array,
};

export default FolderPath;
