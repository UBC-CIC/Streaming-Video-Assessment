export const downloadVideo = async (
  videoURL,
  fileName,
  setDownloadingPercentage,
) => {
  try {
    const response = await fetch(videoURL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const contentLength = Number(response.headers.get("content-length"));
    let receivedBytes = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      receivedBytes += value.length;
      chunks.push(value);

      const percentComplete = (receivedBytes / contentLength) * 100;
      setDownloadingPercentage(Math.round(percentComplete));
    }

    // Create blob from concatenated chunks
    const blob = new Blob([chunks], {
      type: response.headers.get("content-type"),
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `${fileName}-Dropzone.webm`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    setDownloadingPercentage(0);
  } catch (error) {
    console.error("There was an error with the fetch operation:", error);
  }
};
