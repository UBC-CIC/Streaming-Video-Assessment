import PropTypes from "prop-types";
import ListViewFile from "./ListViewFile";

import { FaSortDown } from "react-icons/fa";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function ListView({
  folderData,
  removeFile,
  fetchFolderData,
  sortType,
  setSortType,
}) {
  const { files = [] } = folderData;

  return (
    <div className="pt-4">
      <table className="min-w-full">
        <thead>
          <tr className="bg-stone-50 text-stone-500">
            <th className="p-2 w-[1%] whitespace-nowrap"></th>
            <th
              className="p-2 text-left cursor-pointer"
              onClick={() => setSortType("name")}
            >
              <FaSortDown
                className={`inline pr-1 ${sortType === "name" ? "" : "text-transparent"}`}
              />
              Name
            </th>
            <th
              className="p-2 text-left max-sm:hidden cursor-pointer"
              onClick={() => setSortType("dateDue")}
            >
              <FaSortDown
                className={`inline pr-1 ${sortType === "dateDue" ? "" : "text-transparent"}`}
              />
              Due Date
            </th>
            <th
              className="p-2 text-left max-md:hidden cursor-pointer"
              onClick={() => setSortType("dateModified")}
            >
              <FaSortDown
                className={`inline pr-1 ${sortType === "dateModified" ? "" : "text-transparent"}`}
              />
              Date Modified
            </th>
            <th
              className="p-2 text-left max-md:hidden cursor-pointer"
              onClick={() => setSortType("dateCreated")}
            >
              <FaSortDown
                className={`inline pr-1 ${sortType === "dateCreated" ? "" : "text-transparent"}`}
              />
              Date Created
            </th>
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
