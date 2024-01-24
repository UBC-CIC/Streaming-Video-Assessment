import { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';

import SearchBar from "../components/SearchBar";
import ToggleViewStyle from "../components/ToggleViewStyle";
import GridView from "../components/GridView";
import ListView from "../components/ListView";
import FolderPath from "../components/FolderPath";

import { GoPlusCircle } from "react-icons/go";
import { useLoaderData } from "react-router-dom";

import FolderIcon from "../assets/icons/FolderIcon";
import GroupIcon from "../assets/icons/GroupIcon";
import UploadIcon from "../assets/icons/UploadIcon";

export function loader({ params }) {
    let folderId = null;

    if (params.folderId) {
        folderId = params.folderId;
    } else {
        // TODO: show unknown page
    }

    return folderId;
}

const getHomeFolderId = () => {
    return "HOME"
}

// MOCK DATA
const getFolderData = (folderId) => {
    return {
        path: [
            {name: "Home", id: "HOME"}, 
            {name: "2023", id: "xyz2023"},
            {name: "Tests", id: "xyz2023tests"} 
        ],
        name: "Tests",
        id: "xyz2023tests",
        files: [
            {type: "group", name: "Spanish 30 Students", id: "groupSpanish30", dateCreated: "2015-01-01 14:48:34.69", dateModified: "2015-01-01 14:48:34.69"},
            {type: "folder", name: "Spanish 30", id: "folderSpanish30", dateCreated: "2015-02-01 14:48:34.69", dateModified: "2015-02-02 14:48:34.69"}, 
            {type: "folder", name: "Spanish 20", id: "folderSpanish20", dateCreated: "2015-01-01 14:48:34.69", dateModified: "2015-01-02 14:48:34.69"},
            {type: "assessment", name: "Spanish 30 Final", id: "assessmentSpanish30Final", dateCreated: "2015-03-01 14:48:34.69", dateModified: "2015-03-05 14:48:34.69"},
        ],
    }
}

function FolderView({ home = false }) {

    const userId = "Bob"; // get userID somehow

    let folderId = useLoaderData();
    if (home) {
        folderId = getHomeFolderId();
    }

    const [view, setView] = useState("grid"); // TODO: This should maybe be local storage

    const folderData = getFolderData(folderId);

    useEffect(() => {
        document.title = folderData.name + ' - Dropzone';
    }, []);

    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleButtonClick = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <div className="flex flex-col pl-16 pr-20 py-12 max-md:px-5">
            <SearchBar />
            <div className="self-center flex w-full items-center justify-between gap-5 mt-7 max-md:max-w-full max-md:flex-wrap">
                <div className="justify-center text-black text-lg flex flex-row">
                    <FolderPath folderPath={folderData.path} />
                </div>
                <div className="self-stretch flex items-stretch justify-between gap-2.5">
                    <ToggleViewStyle view={view} setView={setView} />
                    {/* TODO: Add component for button */}
                    <div className="justify-center text-black text-center text-5xl whitespace-nowrap self-center grow items-stretch my-auto p-3 rounded-[50%] max-md:text-4xl max-md:px-5 flex flex-column cursor-pointer">
                        <GoPlusCircle onClick={handleButtonClick}/>
                        {isMenuOpen && (
                            <div className="absolute pt-2 mt-12 max-md:mt-8 space-y-2">
                                <div className="flex justify-center rounded-full bg-blue-400 hover:bg-blue-600" onClick={() => {console.log("create folder")}}>
                                    <FolderIcon width={"45"} height={"50"} />
                                </div>
                                <div className="flex justify-center rounded-full bg-blue-400 hover:bg-blue-600" onClick={() => {console.log("create group")}}>
                                    <GroupIcon width={"35"} height={"50"} />
                                </div>
                                <div className="flex justify-center rounded-full bg-blue-400 hover:bg-blue-600" onClick={() => {console.log("create assessment")}}>
                                    <UploadIcon width={"50"} height={"50"} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {
                view === "grid" ? 
                    <GridView folderData={folderData} /> : 
                    <ListView folderData={folderData} />
            } 
        </div>
    );
}

FolderView.propTypes = {
    home: PropTypes.bool,
};

export default FolderView;
