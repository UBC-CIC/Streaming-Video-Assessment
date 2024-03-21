import { useEffect, useState } from "react";
import ReactPropTypes from "prop-types";
import { useLocation, useNavigate, useLoaderData } from "react-router-dom";
import {
  createAssessment,
  getSharedWithList,
  editAssessment,
} from "../helpers/submissionCreatorApi";
import AssessmentInputFields from "../components/assessment/AssessmentInputFields";
import AssessmentSettings from "../components/assessment/AssessmentSettings";
import AssessmentSharing from "../components/assessment/AssessmentSharing";

function loader({ params }) {
  let submissionId = null;

  if (params.submissionId) {
    submissionId = params.submissionId;
  } else {
    // TODO: show unknown page
  }

  return submissionId;
}

function CreateAndEditSubmission({ edit = false }) {
  const submissionId = useLoaderData();
  const { submissionData, folderId } = useLocation().state || {};
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState({ hours: 0, minutes: 0 });
  const [allowFaceBlur, setAllowFaceBlur] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  const [sharedWithList, setSharedWithList] = useState([]);
  const [email, setEmail] = useState("");
  const [usersName, setUsersName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addedToSharedList, setAddedToSharedList] = useState([]);
  const [removedFromSharedList, setRemovedFromSharedList] = useState([]);

  const getSharedWithListAsync = async (submissionId) => {
    const res = await getSharedWithList(submissionId);
    const newSharedWithList = res.sharedUploaders.concat(res.sharedGroups);
    setSharedWithList(newSharedWithList);
  };

  useEffect(() => {
    // Check the checkbox if its value matches the value to check against
    if (edit) {
      setIsLoading(true);
      setName(submissionData.name);
      setDescription(submissionData.description);
      const hours = Math.floor(submissionData.timeLimitSeconds / 3600);
      const remainingSeconds = submissionData.timeLimitSeconds % 3600;
      const minutes = Math.floor(remainingSeconds / 60);
      setTimeLimit({
        hours: hours,
        minutes: minutes,
      });
      setAllowFaceBlur(submissionData.allowFaceBlur);
      setDueDate(submissionData.dueDate);
      getSharedWithListAsync(submissionId).then(() => {
        setIsLoading(false);
      });
    }
  }, [submissionData]); // Re-run effect when valueToCheck changes

  const assessmentHandler = async () => {
    setIsLoading(true);
    const data = {
      folderId: folderId,
      name: name,
      description: description,
      timeLimitSeconds: timeLimit.hours * 3600 + timeLimit.minutes * 60,
      faceBlurAllowed: allowFaceBlur,
      dueDate: dueDate,
    };
    if (edit) {
      const newSharedUploaders = [];
      const removeSharedUploaders = [];
      const newSharedGroups = [];
      const removeSharedGroups = [];
      addedToSharedList.forEach((item) => {
        if (item.email === undefined) {
          newSharedGroups.push(item);
        } else {
          newSharedUploaders.push(item);
        }
      });
      removedFromSharedList.forEach((item) => {
        if (item.email === undefined) {
          removeSharedGroups.push(item);
        } else {
          removeSharedUploaders.push(item);
        }
      });
      data.newSharedUploaders = newSharedUploaders;
      data.newSharedGroups = newSharedGroups;
      data.removeSharedUploaders = removeSharedUploaders;
      data.removeSharedGroups = removeSharedGroups;
      const response = await editAssessment(submissionId, data);
      setIsLoading(false);
      if (response.success) {
        alert("Assessment edits successfully");
        navigate(`/submission/${response.body.id}`);
      } else {
        alert("Assessment editing failed");
      }
    } else {
      const uploaders = [];
      const groups = [];
      sharedWithList.forEach((item) => {
        if (item.email === undefined) {
          groups.push(item);
        } else {
          uploaders.push(item);
        }
      });
      data.sharedUploaders = uploaders;
      data.sharedGroups = groups;
      const response = await createAssessment(data);
      setIsLoading(false);
      if (response.success) {
        alert("Assessment created successfully");
        navigate(`/submission/${response.body.id}`);
      } else {
        alert("Assessment creation failed");
      }
    }
  };

  return isLoading ? (
    <div className="flex justify-center h-full w-full fixed">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  ) : (
    <div className="flex flex-col m-10">
      <div className="flex flex-col w-full md:flex-row">
        <div className="md:w-[70%]">
          <AssessmentInputFields
            name={name}
            description={description}
            setName={setName}
            setDescription={setDescription}
          />
          <AssessmentSettings
            timeLimit={timeLimit}
            setTimeLimit={setTimeLimit}
            allowFaceBlur={allowFaceBlur}
            setAllowFaceBlur={setAllowFaceBlur}
            dueDate={dueDate}
            setDueDate={setDueDate}
          />
        </div>
        <div className="divider md:divider-horizontal"></div>
        <div className="flex flex-col justify-between items-center md:w-[30%] mt-[0.5rem]">
          <AssessmentSharing
            usersName={usersName}
            setUsersName={setUsersName}
            email={email}
            setEmail={setEmail}
            sharedWithList={sharedWithList}
            setSharedWithList={setSharedWithList}
            edit={edit}
            addedToSharedList={addedToSharedList}
            setAddedToSharedList={setAddedToSharedList}
            removedFromSharedList={removedFromSharedList}
            setRemovedFromSharedList={setRemovedFromSharedList}
          />
        </div>
      </div>
      <div className="flex justify-end mt-10">
        <button
          className="btn bg-indigo-500 btn-lg text-white hover:text-black"
          onClick={assessmentHandler}
        >
          {edit ? "Save" : "Create"}
        </button>
      </div>
    </div>
  );
}

CreateAndEditSubmission.propTypes = {
  edit: ReactPropTypes.bool,
};

CreateAndEditSubmission.loader = loader;

export default CreateAndEditSubmission;
