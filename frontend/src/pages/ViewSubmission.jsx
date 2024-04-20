import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { BsDownload } from "react-icons/bs";
import { formatDateTime } from "../helpers/dateHandler";
import { useNavigate } from "react-router-dom";
import {
  getAssessmentSubmissionInfo,
  getSubmissionData,
} from "../helpers/submissionCreatorApi";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import { downloadVideo } from "../helpers/downloadVideo";
import ProgressLoader from "../components/ProgressLoader";

function loader({ params }) {
  let submissionId = null;
  let assessmentId = null;

  if (params.submissionId) {
    submissionId = params.submissionId;
    assessmentId = params.assessmentId;
  } else {
    // TODO: show unknown page
  }

  return { submissionId, assessmentId };
}

function SubmissionDropdown({
  submissions,
  submissionIndex,
  assessmentId,
  setVideoURL,
}) {
  const navigate = useNavigate();

  return (
    <details className="dropdown dropdown-end">
      <summary className="m-1 btn">
        <div className="flex flex-row items-center">
          All Submissions
          <IoMdArrowDropdown size={20} />
        </div>
      </summary>
      <ul className="shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-60">
        {submissions.map((submission, index) => (
          <li key={index} className="text-md">
            <a
              className={`menu-item ${index === submissionIndex ? "bg-gray-200" : ""}`}
              onClick={() => {
                setVideoURL(null);
                navigate(
                  `/submission/${assessmentId}/view/${submissions[index].submissionId}`,
                );
              }}
            >
              <div className="flex flex-col">
                <p>{submission.name}</p>
                <p className="text-gray-400">{submission.email}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

function ViewSubmission() {
  const navigate = useNavigate();
  const { submissionId, assessmentId } = useLoaderData();
  const [videoURL, setVideoURL] = useState(null);
  const [submissionData, setSubmissionData] = useState({});
  const [currentSubmission, setCurrentSubmissions] = useState({});
  const [submissionIndex, setSubmissionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingPercentage, setDownloadingPercentage] = useState(0);

  useEffect(() => {
    const fetchSubmissionData = async () => {
      setIsLoading(true);
      const fetchedSubmissionData = await getSubmissionData(assessmentId);
      setSubmissionData(fetchedSubmissionData);
      const currentSub = fetchedSubmissionData.submissions.find(
        (submission, index) => {
          if (submission.submissionId == submissionId) {
            setSubmissionIndex(index);
            return true;
          }
        },
      );
      setCurrentSubmissions(currentSub);
      setIsLoading(false);
    };

    const getVideoURL = async () => {
      const res = await getAssessmentSubmissionInfo(assessmentId, submissionId);

      setVideoURL(res.videoUrl);
    };

    fetchSubmissionData();
    getVideoURL();
  }, [assessmentId, submissionId]);

  useEffect(() => {
    document.title = currentSubmission.name;
  }, [currentSubmission]);

  return isLoading ? (
    <div className="flex justify-center h-full w-full fixed">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  ) : (
    <div className="flex flex-col h-screen justify-between">
      <div className="flex flex-col md:flex-row h-[90%]">
        <div className="flex flex-col md:w-[80%] m-6 mt-3 mr-3">
          <button
            className="flex items-center cursor-pointer hover:underline focus:outline-none mb-5"
            onClick={() => navigate(`/submission/${assessmentId}`)}
          >
            <FaArrowLeft className="mr-1" />
            Back
          </button>
          <div className="text-4xl">{submissionData.name}</div>
          <div className="bg-black h-0.5" />
          {videoURL && (
            <div className="w-full h-full flex align-center justify-center relative overflow-hidden	">
              <video controls className="mt-5 w-full h-full">
                <source src={videoURL} type="video/webm" />
              </video>
            </div>
          )}
        </div>
        <div className="flex flex-col md:w-[20%] m-4 ml-3">
          <div className="pt-5 flex flex-col items-center">
            <SubmissionDropdown
              submissions={submissionData.submissions}
              submissionIndex={submissionIndex}
              assessmentId={assessmentId}
              setVideoURL={setVideoURL}
            />
          </div>
          <div className="flex flex-col mt-10">
            <div className="text-2xl">Submissions Details</div>
            <div className="bg-gray-300 h-0.5" />
            <div className="pb-2 pt-2"> Name: {currentSubmission.name}</div>
            <div className="pb-2 pt-2"> Email: {currentSubmission.email}</div>
            <div className="pb-2 pt-2">
              {`Submitted On: ${formatDateTime(new Date(currentSubmission.uploadedOn))}`}
            </div>
          </div>
          <div className="flex flex-col mt-5 items-center">
            <button
              className={`flex flex-row ${isDownloading ? "jusitfy-center" : "justify-between"} text-md btn btn-md w-[75%]`}
              onClick={async () => {
                setIsDownloading(true);
                await downloadVideo(
                  videoURL,
                  currentSubmission.name,
                  setDownloadingPercentage,
                );
                setIsDownloading(false);
              }}
            >
              {isDownloading ? (
                <ProgressLoader
                  percentage={downloadingPercentage}
                  loaderSize={"2rem"}
                  textClassName="text-[0.55rem]"
                />
              ) : (
                <>
                  Download
                  <BsDownload />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div
        className={
          "h-[10%] flex flex-row mr-5 ml-5 " +
          (submissionIndex > 0 ? "justify-between" : "justify-end")
        }
      >
        {submissionIndex > 0 && (
          <button
            className="flex flex-row justify-between text-md btn btn-md w-32"
            onClick={() => {
              setVideoURL(null);
              navigate(
                `/submission/${assessmentId}/view/${submissionData.submissions[submissionIndex - 1].submissionId}`,
              );
            }}
          >
            <IoChevronBack />
            Previous
          </button>
        )}
        {submissionIndex < submissionData.submissions.length - 1 && (
          <button
            className="flex flex-row justify-between text-md btn btn-md w-32"
            onClick={() => {
              setVideoURL(null);
              navigate(
                `/submission/${assessmentId}/view/${submissionData.submissions[submissionIndex + 1].submissionId}`,
              );
            }}
          >
            Next
            <IoChevronForward />
          </button>
        )}
      </div>
    </div>
  );
}

ViewSubmission.loader = loader;

export default ViewSubmission;
