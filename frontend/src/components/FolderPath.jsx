import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function FolderPath({ folderPath = [] }) {
  const navigate = useNavigate();

  const handlePathClick = (id) => {
    if (id === "HOME") {
      return navigate(`/home`);
    }

    return navigate(`/folder/${id}`);
  };

  return (
    <div className="text-md breadcrumbs">
      <ul>
        {folderPath.map((path, index) =>
          index !== folderPath.length - 1 ? (
            <li key={index}>
              <a
                onClick={() => {
                  handlePathClick(path.id);
                }}
              >
                {path.name}
              </a>
            </li>
          ) : (
            <li key={index}>{path.name}</li>
          ),
        )}
      </ul>
    </div>
  );
}

FolderPath.propTypes = {
  folderPath: PropTypes.array.isRequired,
};

export default FolderPath;
