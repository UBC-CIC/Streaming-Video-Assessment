import { useState, useEffect, useCallback } from "react";


import SearchBar from "../components/SearchBar";
import ToggleViewStyle from "../components/ToggleViewStyle";

import GridView from "../components/GridView";
import ListView from "../components/ListView";

import { GoPlusCircle } from "react-icons/go";
import { MdFormatListBulleted } from "react-icons/md";
import { useLoaderData } from "react-router-dom";
// TODO: add react router loader function to retrieve all folders and info from backend and then display on frontend

export function loader({params}) {
    let folderId = null;

    console.log({params})
    if (params.folderId) {
        folderId = params.folderId;
    } else if (true) {

    } else {
        // TODO: show unknown page
    }

    return params;
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
        ],
        name: "Tests",
        id: "xyz2023tests",
        groups: [
            {name: "Spanish 30 Students", id: "groupSpanish30"}
        ],
        folders: [
            {name: "Spanish 30", id: "folderSpanish30"}, {name: "Spanish 20", id: "folderSpanish20"}
        ],
        assessments: [
            {name: "Spanish 30 Final", id: "assessmentSpanish30Final"}
        ],
    }
}

function FolderView({ home = false }) {

    const userId = "Bob"; // get userID somehow

    const folderId = home ? useCallback(getHomeFolderId, [userId]) : useLoaderData().folderId;

    const [view, setView] = useState("grid"); // TODO: This should maybe be local storage

    const folderData = getFolderData(folderId);

    useEffect(() => {
        document.title = folderData.name + ' - Dropzone';
    }, []);


    return (
        <div className="bg-white flex flex-col pl-16 pr-20 py-12 max-md:px-5">
            <SearchBar />
            <div className="self-center flex w-full max-w-[1206px] items-center justify-between gap-5 mt-7 max-md:max-w-full max-md:flex-wrap">
                <div className="justify-center text-black text-lg grow shrink basis-auto my-auto">
                    Home &gt; 2023 &gt; Tests 
                </div>
                <div className="self-stretch flex items-stretch justify-between gap-2.5">
                    <ToggleViewStyle view={view} setView={setView} />
                    <div className="justify-center text-black text-center text-5xl whitespace-nowrap self-center grow items-stretch my-auto p-3 rounded-[50%] max-md:text-4xl max-md:px-5">
                        <GoPlusCircle />
                    </div>
                </div>
            </div>
            {
                view === "grid" ?
                <GridView folderData={folderData} />
                : 
                <ListView folderData={folderData} />
            } 
        </div>
    );
}

export default FolderView;
