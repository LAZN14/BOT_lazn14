class FaceIDHandler {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.stream = null;
        this.model = null;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.bottom = '20px';
        errorDiv.style.left = '20px';
        errorDiv.style.right = '20px';
        errorDiv.style.padding = '15px';
        errorDiv.style.background = '#EF4444';
        errorDiv.style.color = 'white';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.zIndex = '9999';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 3000);
    }

    async initCamera() {
        try {
            this.video = document.createElement('video');
            this.canvas = document.createElement('canvas');
            
            this.video.setAttribute('playsinline', '');
            this.video.setAttribute('autoplay', '');
            this.video.style.width = '100%';
            this.video.style.height = '100%';
            this.video.style.objectFit = 'cover';

            const constraints = {
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };

            try {
                this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch (err) {
                this.stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });
            }

            this.video.srcObject = this.stream;
            
            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.play()
                        .then(resolve)
                        .catch(error => {
                            this.showError('Ошибка запуска видео: ' + error.message);
                            throw error;
                        });
                };
            });
        } catch (err) {
            this.showError('Ошибка: ' + err.message);
            throw err;
        }
    }

    async captureFace() {
        if (!this.video) {
            this.showError('Камера не инициализирована');
            throw new Error('Камера не инициализирована');
        }

        try {
            const context = this.canvas.getContext('2d');
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            context.drawImage(this.video, 0, 0);
            
            const imageData = this.canvas.toDataURL('image/jpeg', 1.0);
            return {
                image: imageData,
                faceData: null
            };
        } catch (err) {
            this.showError('Ошибка при захвате фото: ' + err.message);
            throw err;
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
            });
        }
    }
} 