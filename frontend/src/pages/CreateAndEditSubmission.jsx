import ReactPropTypes from "prop-types";
import { useLocation } from "react-router-dom";

function CreateAndEditSubmission({ edit = false }) {
  const { submissionData } = useLocation().state || {};
  console.log(submissionData);
  return (
    <div>
      <h1>Creating Submission</h1>
    </div>
  );
}

CreateAndEditSubmission.propTypes = {
  edit: ReactPropTypes.bool,
};

export default CreateAndEditSubmission;
