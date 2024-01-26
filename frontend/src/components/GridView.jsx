import PropTypes from "prop-types";
import File from "./File";

function GridView({ folderData }) {
  const { files = [] } = folderData;

  const sortByDateModified = (a, b) => {
    const dateA = new Date(a.dateModified);
    const dateB = new Date(b.dateModified);

    // Compare dates
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  };

  const sortedInputs = files.sort(sortByDateModified);

  return (
    <div className="w-full self-start max-md:mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {sortedInputs.map((file) => (
          <File key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}

GridView.propTypes = {
  folderData: PropTypes.object.isRequired,
};

export default GridView;
