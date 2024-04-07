import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import { GoPlus } from "react-icons/go";
import { useLoaderData, useNavigate } from "react-router-dom";
import FolderIcon from "../assets/icons/FolderIcon";
import GroupIcon from "../assets/icons/GroupIcon";
import UploadIcon from "../assets/icons/UploadIcon";
import ButtonDropdown from "../components/Dropdown";
import FolderPath from "../components/FolderPath";
import GridView from "../components/GridView";
import ListView from "../components/ListView";
import SearchBar from "../components/SearchBar";
import ToggleViewStyle from "../components/ToggleViewStyle";
import CreateFolderDialog from "../components/dialogs/CreateFolderDialog";
import GroupDialog from "../components/dialogs/GroupDialog";
import {
  getFolderData,
  getHomeFolderId,
  ForbiddenError,
} from "../helpers/submissionCreatorApi";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Drawer from "../components/Drawer";

function loader({ params }) {
  let folderId = null;

  if (params.folderId) {
    folderId = parseInt(params.folderId);
  }

  return folderId;
}

function FolderView({ home = false }) {
  const navigate = useNavigate();

  const urlFolderId = useLoaderData();

  useEffect(() => {
    if (urlFolderId == null || home) {
      getHomeFolderId().then(setFolderId);
    } else {
      setFolderId(urlFolderId);
    }
  }, [urlFolderId]);

  const [folderId, setFolderId] = useState();

  const [view, setView] = useState("grid"); // TODO: This should maybe be local storage

  const [folderData, setFolderData] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const createFolderModalRef = useRef(null);
  const createGroupModalRef = useRef(null);

  const fetchFolderData = async () => {
    setIsLoading(true);
    try {
      const fetchedFolderData = await getFolderData(folderId);
      setFolderData(fetchedFolderData);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        navigate("/home");
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (folderId == null) return;

    fetchFolderData();
  }, [folderId]);

  useEffect(() => {
    document.title = folderData.name;
  }, [folderData.name]);

  const removeFile = (file) => {
    const newContents = folderData.files.filter(
      (f) => f.id !== file.id || f.type !== file.type,
    );
    setFolderData({ ...folderData, files: newContents });
  };

  const addFile = (file) => {
    const newContents = folderData.files.push(file);
    setFolderData({ ...folderData, files: newContents });
  };

  const dropdownItems = [
    {
      icon: <FolderIcon width={20} height={20} />,
      text: "Create Folder",
      onclick: () => {
        createFolderModalRef.current.showModal();
      },
    },
    {
      icon: <GroupIcon width={20} height={20} />,
      text: "Create Group",
      onclick: () => {
        createGroupModalRef.current.showModal();
      },
    },
    {
      icon: <UploadIcon width={20} height={20} />,
      text: "Create Submission",
      onclick: () => {
        navigate(`/submission`, {
          state: { folderId },
        });
      },
    },
  ];

  return (
    <Drawer>
      <div className="flex flex-col pl-16 pr-20 pb-12 max-md:px-5">
        <SearchBar />
        {isLoading ? (
          <div className="flex justify-center h-full w-full fixed">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            <div className="self-center flex w-full items-center justify-between gap-5 mt-7 max-md:max-w-full max-md:flex-wrap">
              <div className="justify-center text-black text-lg flex flex-row">
                <DndProvider backend={HTML5Backend}>
                  <FolderPath folderPath={folderData.path} />
                </DndProvider>
              </div>
              <div className="self-stretch flex items-stretch justify-between gap-2.5">
                <ToggleViewStyle view={view} setView={setView} />
                <ButtonDropdown
                  buttonIcon={<GoPlus size={30} />}
                  dropdownItems={dropdownItems}
                />
              </div>
              <GroupDialog
                dialogRef={createGroupModalRef}
                isEdit={false}
                parentId={folderId}
                fetchFolderData={fetchFolderData}
              />
              <CreateFolderDialog
                dialogRef={createFolderModalRef}
                folderId={folderId}
                fetchFolderData={fetchFolderData}
              />
            </div>
            {view === "grid" ? (
              <GridView
                folderData={folderData}
                removeFile={removeFile}
                addFile={addFile}
                fetchFolderData={fetchFolderData}
              />
            ) : (
              // TODO: add drag and drop functionality
              <ListView
                folderData={folderData}
                removeFile={removeFile}
                addFile={addFile}
              />
            )}
          </>
        )}
      </div>
    </Drawer>
  );
}

FolderView.propTypes = {
  home: PropTypes.bool,
};

FolderView.loader = loader;

export default FolderView;
