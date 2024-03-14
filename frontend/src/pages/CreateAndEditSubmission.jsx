import { useEffect, useState } from "react";
import ReactPropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { createAssessment } from "../helpers/submissionCreatorApi";
import AssessmentInputFields from "../components/assessment/AssessmentInputFields";
import AssessmentSettings from "../components/assessment/AssessmentSettings";
import AssessmentSharing from "../components/assessment/AssessmentSharing";

// TODO: add error handling for all input types

function CreateAndEditSubmission({ edit = false }) {
  const { submissionData, folderId } = useLocation().state || {};
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState({ hours: 0, minutes: 0 });
  const [allowFaceBlur, setAllowFaceBlur] = useState(false);
  const [dueDate, setDueDate] = useState(null);
  // TODO: figure out how to get this list and how to deal with individuals and groups
  const [sharedWithList, setSharedWithList] = useState([]);
  const [uploaders, setUploaders] = useState([]);
  const [groups, setGroups] = useState([]);
  const [email, setEmail] = useState("");
  const [usersName, setUsersName] = useState("");

  useEffect(() => {
    // Check the checkbox if its value matches the value to check against
    if (edit) {
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
      if (submissionData.submissions) {
        setSharedWithList(
          submissionData.submissions.map((submission) => ({
            name: submission.name,
            email: submission.email,
          })),
        );
      } else {
        setSharedWithList([]);
      }
    }
  }, [submissionData]); // Re-run effect when valueToCheck changes

  const removeSharedWithUser = (index) => {
    // TODO: need to figure otu handling of group and individuals here
    const newSharedWithList = [...sharedWithList]; // Create a copy of the original array
    newSharedWithList.splice(index, 1);
    setSharedWithList(newSharedWithList);
  };

  const addToSharedList = () => {
    const newSharedWithList = [...sharedWithList];
    const newUploaders = [...uploaders];
    newSharedWithList.push({
      name: usersName,
      email: email,
      type: "individual",
    });
    setSharedWithList(newSharedWithList);
    newUploaders.push({ name: usersName, email: email });
    setUploaders(newUploaders);
    setUsersName("");
    setEmail("");
  };

  const assessmentHandler = async () => {
    if (edit) {
      // TODO: add functionality to edit assessment
      console.log("handling editing of assessment");
    } else {
      // need folderId, name, description, timeLimit, allowFaceBlur, dueDate, sharedUploaders, sharedGroups
      const data = {
        folderId: folderId,
        name: name,
        description: description,
        timeLimitSeconds: timeLimit.hours * 3600 + timeLimit.minutes * 60,
        faceBlurAllowed: allowFaceBlur,
        dueDate: dueDate,
        sharedUploaders: uploaders,
        sharedGroups: groups,
      };

      const message = await createAssessment(data);
      if (message.success) {
        alert("Assessment created successfully");
        navigate(`/submission/${message.body.id}`);
      } else {
        alert("Assessment creation failed");
      }
    }
  };

  return (
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
            sharedWithList={sharedWithList}
            removeSharedWithUser={removeSharedWithUser}
            usersName={usersName}
            setUsersName={usersName}
            email={email}
            setEmail={setEmail}
            addToSharedList={addToSharedList}
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

export default CreateAndEditSubmission;
