import { useEffect, useRef, useState } from "react";
import { BsDownload } from "react-icons/bs";
import { useLoaderData, useNavigate } from "react-router-dom";
import { getSubmissionData } from "../helpers/submissionCreatorApi";
import { formatDateTime } from "../helpers/dateHandler";

function loader({ params }) {
  let submissionId = null;

  if (params.submissionId) {
    submissionId = params.submissionId;
  } else {
    // TODO: show unknown page
  }

  return submissionId;
}

function ViewAllSubmissions() {
  const navigate = useNavigate();
  const submissionId = useLoaderData();
  const [submissionData, setSubmissionData] = useState({});
  const dueDate = useRef(null);
  const timeLimit = useRef({ hours: 0, minutes: 0 });

  useEffect(() => {
    const fetchSubmissionData = async () => {
      const fetchedSubmissionData = await getSubmissionData(submissionId);
      setSubmissionData(fetchedSubmissionData);
    };

    fetchSubmissionData();
    dueDate.current = formatDateTime(new Date(submissionData.dueDate));
    const hours = Math.floor(submissionData.timeLimitSeconds / 3600);
    const remainingSeconds = submissionData.timeLimitSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    timeLimit.current = {
      hours: hours,
      minutes: minutes,
    };
    document.title = submissionData.name;
  }, [submissionData.dueDate, submissionData.name, submissionId]);

  return (
    <div className="flex flex-col w-full md:flex-row h-[100vh]">
      <div className="pr-5 pl-5 md:w-[75%]">
        <div className="flex flex-col justify-between mt-5 pb-6 md:flex-row">
          <div className="flex flex-col text-black pb-2 md:pb-0">
            <div className="text-4xl">{submissionData.name}</div>
            <div className="bg-black h-0.5" />
            {!submissionData.closed ? (
              <div className="mt-2 text-2xl text-green-600">Open</div>
            ) : (
              <div className="mt-2 text-2xl text-red-600">Closed</div>
            )}
            <div className="mt-5 text-2xl">Complete By: {dueDate.current}</div>
            <div className="mt-5 text-2xl">
              Time Limit: {timeLimit.current.hours} hours{" "}
              {timeLimit.current.minutes} mins
            </div>
          </div>
          <div className="flex flex-col">
            {!submissionData.closed ? (
              <button
                className="btn bg-red-600 mb-2 btn-lg text-white hover:text-black"
                onClick={() => {
                  // TODO: add functionality to close submission
                  console.log("Closing Submission");
                }}
              >
                Close Submission
              </button>
            ) : (
              <button
                className="btn bg-green-500 mb-2 btn-lg text-white hover:text-black"
                onClick={() => {
                  // TODO: add functionality to close submission
                  console.log("Opening Submission");
                }}
              >
                Open Submission
              </button>
            )}
            <button
              className="btn bg-indigo-500 btn-lg text-white hover:text-black"
              onClick={() => {
                navigate(`/submission/${submissionId}/edit`, {
                  state: { submissionData },
                });
              }}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg text-lg overflow-y-auto p-5 h-[70%]">
          {submissionData.description}
        </div>
      </div>
      <div className="divider md:divider-horizontal"></div>
      <div className="pr-5 pl-5 flex flex-col justify-between mt-5 items-center md:w-[25%]">
        <div className="w-full">
          <div className="text-4xl">Submissions</div>
          <div className="bg-black h-0.5" />
          <div className="mt-5 overflow-y-auto">
            {submissionData.submissions?.map((submission, index) => {
              return (
                submission.s3ref && (
                  <div
                    className="mb-4 flex flex-row justify-between text-lg btn btn-lg"
                    onClick={() => {
                      navigate(`/submission/${submission.submissionId}/view`, {
                        state: {
                          submissionData,
                          submissions: submissionData.submissions,
                          submissionIndex: index,
                        },
                      });
                    }}
                    key={index}
                  >
                    <div className="truncate w-[70%] flex justify-start">
                      <abbr
                        title={submission.name}
                        style={{ textDecoration: "none" }}
                      >
                        {submission.name}
                      </abbr>
                    </div>
                    <BsDownload
                      className="text-stone-500 hover:text-stone-900 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Downloading Submission");
                      }}
                    />
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

ViewAllSubmissions.loader = loader;

export default ViewAllSubmissions;
