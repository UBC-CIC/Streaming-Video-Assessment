import { useEffect, useRef, useState } from "react";
import { BsDownload } from "react-icons/bs";
import { useLoaderData, useNavigate } from "react-router-dom";
import { getSubmissionData } from "../helpers/submissionCreatorApi";
import { formatDateTime } from "../helpers/dateHandler";
import AssessmentClosedDialog from "../components/AssessmentClosedDialog";
import AssessmentOpenDialog from "../components/AssessmentOpenDialog";
import {
  editAssessment,
  getAssessmentSubmissionInfo,
} from "../helpers/submissionCreatorApi";
import FolderPath from "../components/assessment/FolderPath";
import { useToast } from "../components/Toast/ToastService";
import { downloadVideo } from "../helpers/downloadVideo";
import { FaArrowLeft } from "react-icons/fa";
import ProgressLoader from "../components/ProgressLoader";

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
  const [isLoading, setIsLoading] = useState(true);
  const assessmentClosedDialogRef = useRef(null);
  const assessmentOpenDialogRef = useRef(null);
  const [isPassDueDate, setIsPassDueDate] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchSubmissionData = async () => {
      setIsLoading(true);
      const fetchedSubmissionData = await getSubmissionData(submissionId);
      setSubmissionData(fetchedSubmissionData);
      setIsLoading(false);
    };

    fetchSubmissionData();
  }, [submissionId]);

  useEffect(() => {
    if (submissionData.dueDate) {
      dueDate.current = formatDateTime(new Date(submissionData.dueDate));
    }

    if (submissionData.timeLimitSeconds) {
      const hours = Math.floor(submissionData.timeLimitSeconds / 3600);
      const remainingSeconds = submissionData.timeLimitSeconds % 3600;
      const minutes = Math.floor(remainingSeconds / 60);
      timeLimit.current = {
        hours: hours,
        minutes: minutes,
      };
    }

    document.title = submissionData.name;
  }, [
    submissionData.dueDate,
    submissionData.timeLimitSeconds,
    submissionData.name,
  ]);

  const navigateToEditing = () => {
    navigate(`/submission/${submissionId}/edit`, {
      state: { submissionData },
    });
  };

  const editAssesmentOnClickHandler = () => {
    if (submissionData.closed) {
      assessmentClosedDialogRef.current.showModal();
      return;
    }

    navigateToEditing();
  };

  const openSubmissionOnClickHandler = () => {
    // check current due date
    const passDueDate = new Date(submissionData.dueDate) < new Date();
    setIsPassDueDate(passDueDate);

    assessmentOpenDialogRef.current.showModal();
  };

  const onOpenDialogClickHandler = async (newDueDate) => {
    assessmentOpenDialogRef.current.close();

    const body = {
      closedEarly: false,
    };

    if (isPassDueDate) {
      if (newDueDate === "") return;
      body.dueDate = newDueDate;
    }

    setIsLoading(true);
    const response = await editAssessment(submissionId, body);
    if (response.success) {
      const newSubmissionData = { ...submissionData };
      newSubmissionData.closed = false;

      const newDate = body.dueDate
        ? formatDateTime(new Date(body.dueDate))
        : dueDate.current;
      dueDate.current = newDate;
      newSubmissionData.dueDate = body.dueDate
        ? body.dueDate
        : submissionData.dueDate;
      setSubmissionData(newSubmissionData);
    } else {
      toast.error("Could not open assessment");
    }
    setIsLoading(false);
  };

  const closeSubmissionOnClickHandler = async () => {
    const body = {
      closedEarly: true,
    };
    setIsLoading(true);
    const response = await editAssessment(submissionId, body);
    if (response.success) {
      const newSubmissionData = { ...submissionData };
      newSubmissionData.closed = true;
      setSubmissionData(newSubmissionData);
    } else {
      toast.error("Could not close assessment");
    }
    setIsLoading(false);
  };

  const folderOnClickHandler = (folderId, index) => {
    if (index === 0) {
      return navigate(`/home`);
    }

    return navigate(`/folder/${folderId}`);
  };

  return isLoading ? (
    <div className="flex justify-center h-full w-full fixed">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  ) : (
    <div className="flex flex-col w-full md:flex-row h-[100vh]">
      <div className="pr-5 pl-5 md:w-[70%]">
        <div className="mt-3">
          <button
            className="flex items-center cursor-pointer hover:underline focus:outline-none"
            onClick={() => navigate(`/folder/${submissionData.folderId}`)}
          >
            <FaArrowLeft className="mr-1" />
            Back
          </button>
          <FolderPath
            folderPath={submissionData.folderPath}
            onClickHandler={folderOnClickHandler}
            makeLastCrumbClickable={false}
          />
        </div>
        <div className="flex flex-col justify-between pb-4 md:flex-row">
          <div className="flex flex-col text-black pb-2 md:pb-0">
            <div className="text-4xl">{submissionData.name}</div>
            <div className="bg-black h-0.5" />
            {!submissionData.closed ? (
              <div className="mt-1 text-2xl text-green-600">Open</div>
            ) : (
              <div className="mt-1 text-2xl text-red-600">Closed</div>
            )}
            <div className="mt-3 text-2xl">Complete By: {dueDate.current}</div>
            <div className="mt-1 text-2xl">
              Time Limit: {timeLimit.current.hours} hours{" "}
              {timeLimit.current.minutes} mins
            </div>
          </div>
          <div className="flex flex-col">
            {!submissionData.closed ? (
              <button
                className="btn bg-red-600 mb-2 btn-lg text-white hover:text-black"
                onClick={closeSubmissionOnClickHandler}
              >
                Close Submission
              </button>
            ) : (
              <button
                className="btn bg-green-500 mb-2 btn-lg text-white hover:text-black"
                onClick={openSubmissionOnClickHandler}
              >
                Open Submission
              </button>
            )}
            <button
              className="btn bg-indigo-500 btn-lg text-white hover:text-black"
              onClick={editAssesmentOnClickHandler}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg text-lg overflow-y-auto p-5 h-[65%] whitespace-pre-wrap">
          {submissionData.description}
        </div>
      </div>
      <div className="divider md:divider-horizontal"></div>
      <div className="pr-5 pl-5 flex flex-col justify-between mt-5 items-center md:w-[30%]">
        <div className="w-full h-full">
          <div className="text-4xl">Submissions</div>
          <div className="bg-black h-0.5" />
          <div className="mt-5 overflow-y-auto h-[90%] whitespace-pre-wrap">
            {submissionData.submissions?.map((submission, index) => {
              return (
                <div
                  className="mb-4 flex flex-row justify-between text-lg btn btn-lg"
                  onClick={() => {
                    navigate(
                      `/submission/${submissionId}/view/${submission.submissionId}`,
                    );
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
                  <DownloadingButton
                    submissionId={submissionId}
                    submission={submission}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <AssessmentClosedDialog
        dialogRef={assessmentClosedDialogRef}
        onContinueHandler={navigateToEditing}
      />
      <AssessmentOpenDialog
        dialogRef={assessmentOpenDialogRef}
        onContinueHandler={onOpenDialogClickHandler}
        isPassDueDate={isPassDueDate}
      />
    </div>
  );
}

function DownloadingButton({ submissionId, submission }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingPercentage, setDownloadingPercentage] = useState(0);

  return isDownloading ? (
    <ProgressLoader
      percentage={downloadingPercentage}
      loaderSize={"2rem"}
      textClassName="text-[0.55rem]"
    />
  ) : (
    <BsDownload
      className="text-stone-500 hover:text-stone-900 cursor-pointer"
      onClick={async (e) => {
        e.stopPropagation();
        setIsDownloading(true);
        const res = await getAssessmentSubmissionInfo(
          submissionId,
          submission.submissionId,
        );

        await downloadVideo(
          res.videoUrl,
          submission.name,
          setDownloadingPercentage,
        );
        setIsDownloading(false);
      }}
    />
  );
}

ViewAllSubmissions.loader = loader;

export default ViewAllSubmissions;
