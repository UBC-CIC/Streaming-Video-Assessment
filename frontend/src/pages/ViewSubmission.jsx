import { getUrl } from "aws-amplify/storage";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function ViewSubmission() {
  const { submissions } = useLocation().state;
  const [videoURL, setVideoURL] = useState(null);

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
    <div>
      {videoURL && (
        <video width="70%" controls>
          <source src={videoURL} type="video/webm" />
        </video>
      )}
    </div>
  );
}

export default ViewSubmission;
