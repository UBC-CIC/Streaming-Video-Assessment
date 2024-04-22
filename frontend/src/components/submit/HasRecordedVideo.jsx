const HasRecordedVideo = ({ className, uploadedVideoUrl }) => {
  if (!uploadedVideoUrl) {
    return (
      <div className="flex items-center justify-center w-100 h-48">
        Please wait while the upload completes.
      </div>
    );
  }

  return (
    <div className={className}>
      <video
        controls
        src={uploadedVideoUrl}
        className="max-w-full max-h-full"
      ></video>
    </div>
  );
};

export default HasRecordedVideo;
