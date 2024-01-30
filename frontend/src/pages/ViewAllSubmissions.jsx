import { useLoaderData } from "react-router-dom";
import { BsDownload } from "react-icons/bs";

export function loader({ params }) {
  let submissionId = null;

  if (params.submissionId) {
    submissionId = params.submissionId;
  } else {
    // TODO: show unknown page
  }

  return submissionId;
}

function ViewAllSubmissions() {
  let submissionId = useLoaderData();
  return (
    <div className="flex flex-col w-full mt-1 lg:flex-row">
      <div className="pr-5 pl-5 lg:w-[75%]">
        <div className="flex flex-row justify-between mt-5 pb-6">
          <div className="flex flex-col text-black">
            <div className="text-4xl">Spanish Oral Exam</div>
            <div className="bg-black h-0.5" />
            <div className="mt-2 text-2xl text-green-600">Open</div>
            <div className="mt-5 text-2xl">Complete By: &lt;Date&gt;</div>
            <div className="mt-5 text-2xl">Time Limit: &lt;Time in min&gt;</div>
          </div>
          <div className="flex flex-col">
            <button className="btn bg-red-600 mb-2 btn-lg text-white hover:text-black">
              Close Submission
            </button>
            <button className="btn bg-indigo-500 btn-lg text-white hover:text-black">
              Edit
            </button>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg text-lg overflow-y-auto h-[43rem] p-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin congue
          vitae odio eget condimentum. Fusce rhoncus ultricies libero et
          molestie. Vivamus eget blandit diam. Quisque vel tortor vitae nulla
          tincidunt egestas. Aliquam congue, diam sed finibus tincidunt, mauris
          est efficitur nibh, ac eleifend arcu leo a metus. Quisque gravida
          massa id mi bibendum, at accumsan lacus tempor. Sed metus odio,
          tincidunt at rhoncus at, lacinia a erat. Ut eget lorem nec sem maximus
          accumsan vitae lacinia risus. Aenean luctus congue iaculis. Nam et
        </div>
      </div>
      <div className="divider lg:divider-horizontal"></div>
      <div className="pr-5 pl-5 flex flex-col justify-between mt-5 items-center lg:w-[25%]">
        <div className="w-full">
          <div className="text-4xl">Submission</div>
          <div className="bg-black h-0.5" />
          <div className="mt-5 overflow-y-auto h-[47rem]">
            <div
              className="mb-4 flex flex-row justify-between text-lg btn btn-lg"
              onClick={() => {
                console.log("TEST");
              }}
            >
              <div className="truncate w-[70%] flex justify-start">
                <abbr title="Email" style={{ "text-decoration": "none" }}>
                  Email
                </abbr>
              </div>
              <BsDownload
                className="text-stone-500 hover:text-stone-900 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Inner button clicked");
                }}
              />
            </div>
          </div>
        </div>
        <button className="btn btn-wide btn-lg justify-center">
          Download All
        </button>
      </div>
    </div>
  );
}

export default ViewAllSubmissions;
