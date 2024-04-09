import PropTypes from "prop-types";
import ListViewFile from "./ListViewFile";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function ListView({ folderData, removeFile, fetchFolderData }) {
  const { files = [] } = folderData;

  return (
    <div className="pt-4">
      <table className="min-w-full">
        <thead>
          <tr className="bg-stone-50 text-stone-500">
            <th className="p-2 w-[1%] whitespace-nowrap"></th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left max-sm:hidden">Due Date</th>
            <th className="p-2 text-left max-md:hidden">Date Modified</th>
            <th className="p-2 text-left max-md:hidden">Date Created</th>
            <th className="p-2"></th>
            <th className="p-2"></th>
          </tr>
        </thead>
        {files.map((file, index) => (
          <DndProvider backend={HTML5Backend} key={index}>
            <ListViewFile
              key={index}
              index={index}
              file={file}
              removeFile={removeFile}
              fetchFolderData={fetchFolderData}
            />
          </DndProvider>
        ))}
      </table>
    </div>
  );
}

ListView.propTypes = {
  folderData: PropTypes.object.isRequired,
};

export default ListView;
