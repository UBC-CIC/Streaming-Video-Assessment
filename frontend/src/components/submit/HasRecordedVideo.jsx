const HasRecordedVideo = ({ uploadedVideoUrl }) => {
  if (!uploadedVideoUrl) {
    return (
      <div className="flex items-center justify-center w-100 h-48">
        Please wait while the upload completes.
      </div>
    );
  }

  return (
    <div>
      <video controls src={uploadedVideoUrl}></video>
    </div>
  );
};

export default HasRecordedVideo;
