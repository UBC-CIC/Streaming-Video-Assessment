import { useState, useEffect, useCallback } from "react";

import SearchBar from "../components/SearchBar";
import ToggleViewStyle from "../components/ToggleViewStyle";

import GridView from "../components/GridView";
import ListView from "../components/ListView";

import { GoPlusCircle } from "react-icons/go";
import { MdFormatListBulleted } from "react-icons/md";
import { useLoaderData, useSearchParams } from "react-router-dom";
import SubmitDetails from "../components/submit/SubmitDetails";
import SubmitRecord from "../components/submit/SubmitRecord";
// TODO: add react router loader function to retrieve all folders and info from backend and then display on frontend

export function loader({params}) {
    return params;
}

// MOCK
const getAssignmentInfo = (assignmentId, secret) => {
    return {
        completedOn: null,
        name: "Spanish 30 Final",
        description: "This is a description of the assignment",
        dueDate: "2021-12-31",
        timeLimitMinutes: 30,
        allowFaceBlur: true,
    }
}

function FolderView() {

    const [searchParams, setSearchParams] = useSearchParams();

    const [currentSubmitState, setCurrentSubmitState] = useState("details");

    const assignmentId = useLoaderData().assignmentId;

    const assignmentData = getAssignmentInfo(assignmentId, searchParams.get("k"));

    useEffect(() => {
        document.title = assignmentData.name + ' - Dropzone';
    }, []);


    return (
        {
            "details": <SubmitDetails assignmentData={assignmentData} begin={() => setCurrentSubmitState("record")} />,
            "record": <SubmitRecord assignmentData={assignmentData} />,
        }[currentSubmitState]
    );
}

export default FolderView;
