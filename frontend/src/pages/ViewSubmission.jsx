import { useLocation } from "react-router-dom";

function ViewSubmission() {
  const { submissions } = useLocation().state;
  return (
    <div>
      <h1>View Submission</h1>
    </div>
  );
}

export default ViewSubmission;
