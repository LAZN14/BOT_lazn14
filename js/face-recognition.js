let isScanning = false;
let scanAttempts = 0;
const MAX_SCAN_ATTEMPTS = 3;
let confidenceScores = [];

async function loginWithFaceID() {
    if (isScanning) return;
    isScanning = true;
    scanAttempts = 0;
    confidenceScores = [];
    
    try {
        const modal = document.getElementById('faceID-modal');
        const video = document.getElementById('video');
        const progressBar = document.getElementById('scanProgress');
        modal.style.display = 'block';
        progressBar.style.width = '0%';

        await loadFaceAPIModels();
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 }
            } 
        });
        
        video.srcObject = stream;
        video.addEventListener('play', startFaceDetection);

    } catch (error) {
        console.error('Ошибка:', error);
        isScanning = false;
        alert('Ошибка при запуске камеры: ' + error.message);
        closeFaceIDModal();
    }
}

// Добавьте остальные функции из предыдущего кода 