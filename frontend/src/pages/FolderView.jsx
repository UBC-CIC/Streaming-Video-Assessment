import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { FaSignOutAlt } from "react-icons/fa";
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
} from "../helpers/submissionCreatorApi";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { handleSignOut } from "../helpers/authenticationHandler";

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

  useEffect(() => {
    if (folderId == null) return;

    const fetchFolderData = async () => {
      const fetchedFolderData = await getFolderData(folderId);
      setFolderData(fetchedFolderData);
    };
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
        document.getElementById("folder-modal").showModal();
      },
      modal: <CreateFolderDialog folderId={folderId} />,
    },
    {
      icon: <GroupIcon width={20} height={20} />,
      text: "Create Group",
      onclick: () => {
        document.getElementById("create-group-modal").showModal();
      },
      modal: <GroupDialog isEdit={false} parentId={folderId} />,
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
    <div className="flex flex-col pl-16 pr-20 py-12 max-md:px-5">
      <SearchBar />
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
      </div>
      {view === "grid" ? (
        <GridView
          folderData={folderData}
          removeFile={removeFile}
          addFile={addFile}
        />
      ) : (
        // TODO: add drag and drop functionality
        <ListView
          folderData={folderData}
          removeFile={removeFile}
          addFile={addFile}
        />
      )}
    </div>
  );
}

FolderView.propTypes = {
  home: PropTypes.bool,
};

FolderView.loader = loader;

export default FolderView;
