import { getIcon } from "../../../helpers/getIcon";
import FolderPath from "./FolderPath";

function FileView({ file, index, fetchGroups, addToSharedList }) {
  const icon = getIcon(file);

  const onClickHandler = () => {
    if (file.type === "group") {
      addToSharedList("group", file);
      document.getElementById("groupView").close();
    } else {
      fetchGroups(file.id);
    }
  };

  return (
    <div className="w-full rounded-3xl max-w-sm bg-gray-300 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div
        className="flex flex-col items-center pb-5 cursor-pointer"
        key={index}
        onClick={onClickHandler}
      >
        {icon}
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white truncate w-[95%] text-center">
          {file.name}
        </h5>
      </div>
    </div>
  );
}

function GroupView({ isLoading, files, path, fetchGroups, addToSharedList }) {
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center h-full">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl flex justify-center">Groups</h1>
          <FolderPath folderPath={path} fetchGroups={fetchGroups} />
          <div className="w-full self-start pt-3 max-md:mt-10">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files.map((file, index) => (
                <FileView
                  key={index}
                  file={file}
                  index={index}
                  fetchGroups={fetchGroups}
                  addToSharedList={addToSharedList}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupView;