const bar = document.querySelector("#ball");

function calcularDistancia(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});

// Recibir los resultados
hands.onResults((results) => {
    console.log(results); // Contiene los datos de las manos detectadas
});


const videoElement = document.getElementById('input_video');

// Obtener la cámara
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    videoElement.srcObject = stream;
    videoElement.play();

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 640,
        height: 480,
    });
    camera.start();
});


const canvasElement = document.querySelector('#canvas');
const canvasCtx = canvasElement.getContext('2d');

hands.onResults((results) => {

    console.log("Dentro");



    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    for (const landmarks of results.multiHandLandmarks) {



        try {
            const punto1 = results.multiHandLandmarks[0][4]; // Ejemplo: ojo izquierdo
            const punto2 = results.multiHandLandmarks[0][8]; // Ejemplo: ojo derecho

            const distancia = calcularDistancia(punto1, punto2);
            console.log('Distancia entre dedos:', distancia);

            const layout = document.querySelector('.layout');
            const widthBar = distancia * 100 * 2 + "%";


            if ((distancia * 100 * 2) >= 100) {
                bar.style.width = 100 + "%";
            } else {
                bar.style.width = distancia * 100 * 2 + "%";

            }

            if (distancia >= 0.10) {
                layout.style.backgroundColor = 'black';

            } else {
                layout.style.backgroundColor = '#f73828';
            }
        } catch (error) {

        }



        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1 });
    }
});
