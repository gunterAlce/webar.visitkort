const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const modelContainer = document.getElementById('model');

// Get access to the camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(err => {
        console.error('Error accessing the camera', err);
    });

video.addEventListener('canplay', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    requestAnimationFrame(tick);
});

function tick() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
        load3DModel(code.data);
    }
    requestAnimationFrame(tick);
}

function load3DModel(url) {
    modelContainer.innerHTML = ''; // Clear previous model
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    modelContainer.appendChild(renderer.domElement);

    const loader = new THREE.GLTFLoader();
    loader.load(url, (gltf) => {
        scene.add(gltf.scene);
        camera.position.z = 5;
        const animate = function () {
            requestAnimationFrame(animate);
            gltf.scene.rotation.x += 0.01;
            gltf.scene.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    }, undefined, (error) => {
        console.error(error);
    });
}
