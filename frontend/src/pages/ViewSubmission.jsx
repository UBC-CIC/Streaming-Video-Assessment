import { useLoaderData } from "react-router-dom";

export function loader({ params }) {
  let submissionId = null;

  if (params.submissionId) {
    submissionId = params.submissionId;
  } else {
    // TODO: show unknown page
  }

  return submissionId;
}

function ViewSubmission() {
  let submissionId = useLoaderData();
  return (
    <div>
      <h1>Viewing Submission: {submissionId}</h1>
    </div>
  );
}

export default ViewSubmission;
