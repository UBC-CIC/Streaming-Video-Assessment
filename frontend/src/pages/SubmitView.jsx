import { useState, useEffect, useCallback } from "react";

import { useLoaderData, useSearchParams } from "react-router-dom";
import SubmitDetails from "../components/submit/SubmitDetails";
import SubmitRecord from "../components/submit/SubmitRecord";

import { getAssessmentInfo, submitVideo } from "../helpers/uploaderApi";
import * as faceapi from "face-api.js";

// TODO: add react router loader function to retrieve all folders and info from backend and then display on frontend

export function loader({ params }) {
  return params;
}

const faceDetectorOptions = new faceapi.TinyFaceDetectorOptions();

function SubmitView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentSubmitState, setCurrentSubmitState] = useState("details");
  const [canLoadAssessment, setCanLoadAssessment] = useState(true);

  const assessmentId = useLoaderData().submissionId;

  const [assessmentData, setAssessmentData] = useState(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL =
        "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ])
        .then(() => console.log("Loaded models"))
        .then(setModelsLoaded(true));
    };
    console.log("Loading models");
    loadModels();
  }, []);

  const detectFaces = useCallback(
    (video) => {
      if (!modelsLoaded) return;
      return faceapi.detectAllFaces(video, faceDetectorOptions);
    },
    [modelsLoaded],
  );

  const confirmSubmission = async () => {
    await submitVideo(assessmentId, searchParams.get("secret"));
    setCurrentSubmitState("details");
  };

  useEffect(() => {
    if (assessmentData && assessmentData.name) {
      document.title = assessmentData.name + " - Dropzone";
    } else {
      document.title = "Dropzone";
    }
  }, [assessmentData]);

  useEffect(() => {
    if (currentSubmitState === "record") return;
    setAssessmentData(null);
    getAssessmentInfo(assessmentId, searchParams.get("secret"))
      .then(setAssessmentData)
      .catch(() => setCanLoadAssessment(false));
  }, [currentSubmitState, searchParams, assessmentId]);

  if (!canLoadAssessment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="mx-auto">
          <h2 className="text-2xl font-semibold">
            Assignment could not be loaded.
          </h2>
        </div>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="mx-auto">
          <div role="status" className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return {
    details: (
      <SubmitDetails
        assessmentData={assessmentData}
        begin={() => setCurrentSubmitState("record")}
      />
    ),
    record: (
      <SubmitRecord
        detectFaces={detectFaces}
        modelsLoaded={modelsLoaded}
        assessmentData={assessmentData}
        confirmSubmission={confirmSubmission}
      />
    ),
  }[currentSubmitState];
}

export default SubmitView;
