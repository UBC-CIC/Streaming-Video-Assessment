export const downloadVideo = async (
  videoURL,
  fileName,
  setDownloadingPercentage,
) => {
  const response = await fetch(videoURL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const totalBytes = response.headers.get("content-length");
  let receivedBytes = 0;

  const reader = response.body.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedBytes += value.length;
    const progress = Math.round((receivedBytes / totalBytes) * 100);
    setDownloadingPercentage(progress);
  }

  const blob = new Blob(chunks, { type: "video/mp4" });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName}-Dropzone.mp4`);
  document.body.appendChild(link);
  link.click();
};
