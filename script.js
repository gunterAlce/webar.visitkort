const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const videoPlayer = document.getElementById('videoPlayer');

// Get access to the camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
        console.log("Camera stream started");
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error('Error accessing the camera', err);
    });

video.addEventListener('canplay', () => {
    if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        console.log("Video dimensions:", video.videoWidth, video.videoHeight);
        requestAnimationFrame(tick);
    } else {
        console.error("Video dimensions are not available.");
    }
});

function tick() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
        console.log("QR Code detected:", code.data);
        loadVideo(code.data);
    } else {
        console.log("No QR code detected.");
    }
    requestAnimationFrame(tick);
}

function loadVideo(url) {
    console.log("Loading video from URL:", url);
    videoPlayer.src = url;
    videoPlayer.style.display = 'block';
    videoPlayer.play().then(() => {
        console.log("Video playing.");
    }).catch(err => {
        console.error("Error playing video:", err);
    });
}
