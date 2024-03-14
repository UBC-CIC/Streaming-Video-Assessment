import PropTypes from "prop-types";
import File from "./File";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function GridView({ folderData }) {
  const { files = [], id } = folderData;

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
        {sortedInputs.map((file, index) => (
          <DndProvider backend={HTML5Backend} key={index}>
            <File key={file.id} file={file} />
          </DndProvider>
        ))}
      </div>
    </div>
  );
}

GridView.propTypes = {
  folderData: PropTypes.object.isRequired,
};

export default GridView;
