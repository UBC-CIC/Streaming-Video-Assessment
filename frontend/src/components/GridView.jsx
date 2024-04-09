import PropTypes from "prop-types";
import File from "./File";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function GridView({ folderData, removeFile, fetchFolderData }) {
  const { files = [] } = folderData;

  return (
    <div className="w-full self-start max-md:mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {files.map((file, index) => (
          <DndProvider backend={HTML5Backend} key={index}>
            <File
              key={file.type + file.id}
              removeFile={removeFile}
              file={file}
              fetchFolderData={fetchFolderData}
            />
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
