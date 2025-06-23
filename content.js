(async function () {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("face-api.min.js");
  document.head.appendChild(script);

  script.onload = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri(chrome.runtime.getURL("models"));
    const video = document.createElement("video");
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.style.display = "none";
    document.body.appendChild(video);

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
    });

    const overlay = document.createElement("div");
    overlay.id = "blur-overlay";
    document.body.appendChild(overlay);

    video.addEventListener("play", () => {
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        if (detections.length > 1) {
          overlay.style.display = "block";
        } else {
          overlay.style.display = "none";
        }
      }, 1000);
    });
  };
})();