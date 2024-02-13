import { getUrl } from "aws-amplify/storage";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { BsDownload } from "react-icons/bs";
import { getDueDate } from "../helpers/dateHandler";
import { useNavigate } from "react-router-dom";

function SubmissionDropdown({ submissions, submissionIndex }) {
  console.log(submissions, submissionIndex);
  return (
    <details className="dropdown">
      <summary className="m-1 btn">All Submissions</summary>
      <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        {/* // TODO: render each submission and their name and change the colour of the one that is currently selected */}
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
      </ul>
    </details>
  );
}

function ViewSubmission() {
  const navigate = useNavigate();
  const { submissionData, submissions, submissionIndex } = useLocation().state;
  const [videoURL, setVideoURL] = useState(null);
  const currentSubmission = submissions[submissionIndex];

  useState(() => {
    const getVideoURL = async () => {
      const getUrlResult = await getUrl({
        key: "abc/1.webm",
      });
      setVideoURL(getUrlResult.url);
    };
    getVideoURL();
    document.title = submissions[0].name;
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col pt-4 md:w-[65%]">
          <div className="text-4xl">{submissionData.name}</div>
          <div className="bg-black h-0.5" />
          {videoURL && (
            <video controls>
              <source src={videoURL} type="video/webm" />
            </video>
          )}
        </div>
        <div className="flex flex-col pt-4 md:w-[35%]">
          <SubmissionDropdown
            submissions={submissions}
            submissionIndex={submissionIndex}
          />
          <button
            className="flex flex-row justify-between text-lg btn btn-lg"
            onClick={() => {
              console.log("Downloading All");
            }}
          >
            Download
            <BsDownload />
          </button>
          <div className="text-4xl">Submissions Details</div>
          <div className="bg-black h-0.5" />
          <div> Name: {currentSubmission.name}</div>
          <div> Email: {currentSubmission.email}</div>
          <div>
            {" "}
            Submitted On: {getDueDate(new Date(currentSubmission.uploadedOn))}
          </div>
        </div>
      </div>
      <div
        className={
          "flex flex-row mr-5 ml-5 " +
          (submissionIndex > 0 ? "justify-between" : "justify-end")
        }
      >
        {submissionIndex > 0 && (
          <button
            className="flex flex-row justify-between text-lg btn btn-lg"
            onClick={() => {
              navigate(
                `/submission/${submissions[submissionIndex - 1].submissionId}/view`,
                {
                  state: {
                    submissionData,
                    submissions,
                    submissionIndex: submissionIndex - 1,
                  },
                },
              );
            }}
          >
            <BsDownload />
            Previous
          </button>
        )}
        {submissionIndex < submissions.length - 1 && (
          <button
            className="flex flex-row justify-between text-lg btn btn-lg"
            onClick={() => {
              navigate(
                `/submission/${submissions[submissionIndex + 1].submissionId}/view`,
                {
                  state: {
                    submissionData,
                    submissions,
                    submissionIndex: submissionIndex + 1,
                  },
                },
              );
            }}
          >
            Next
            <BsDownload />
          </button>
        )}
      </div>
    </div>
  );
}

export default ViewSubmission;
