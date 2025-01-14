const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');

function calcularDistancia(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Configuración de Face Mesh
const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});

faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true, // Refina los puntos de los ojos y labios
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});

// Manejo de resultados
faceMesh.onResults((results) => {
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks) {

        try {
            const punto1 = results.multiFaceLandmarks[0][0]; // Ejemplo: ojo izquierdo
            const punto2 = results.multiFaceLandmarks[0][17]; // Ejemplo: ojo derecho

            const distancia = calcularDistancia(punto1, punto2);
            console.log('Distancia entre ojos:', distancia);

            const layout = document.querySelector('.layout');
            if (distancia >= 0.10) {
                layout.style.backgroundColor = 'red';
            } else {
                layout.style.backgroundColor = 'black';
            }

        } catch (error) {

        }





        for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: '#FF3030' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: '#30FF30' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0' });
            drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }
    }
});

// Configuración de la cámara
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await faceMesh.send({ image: videoElement });
    },
    width: 640,
    height: 480,
});

camera.start();
