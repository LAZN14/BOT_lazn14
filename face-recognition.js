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
        if (typeof blazeface === 'undefined') {
            this.showError('Библиотека BlazeFace не загружена');
            throw new Error('Библиотека BlazeFace не загружена');
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showError('Ваше устройство не поддерживает доступ к камере');
            throw new Error('Ваше устройство не поддерживает доступ к камере');
        }

        try {
            this.showError('Загрузка модели...');
            this.model = await blazeface.load();
            this.showError('Модель успешно загружена');

            this.video = document.createElement('video');
            this.canvas = document.createElement('canvas');
            
            this.video.setAttribute('playsinline', '');
            this.video.setAttribute('autoplay', '');
            this.video.style.width = '100%';
            this.video.style.height = '100%';
            this.video.style.objectFit = 'cover';

            this.showError('Запрос доступа к камере...');
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                },
                audio: false
            });
            this.showError('Доступ к камере получен');

            this.video.srcObject = this.stream;
            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.showError('Видео метаданные загружены');
                    this.video.play()
                        .then(() => {
                            this.showError('Видео запущено');
                            resolve();
                        })
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
        if (!this.video || !this.model) {
            this.showError('Камера не инициализирована');
            throw new Error('Камера не инициализирована');
        }

        try {
            const predictions = await this.model.estimateFaces(this.video, false);
            
            if (predictions.length === 0) {
                this.showError('Лицо не обнаружено');
                throw new Error("Лицо не обнаружено");
            }

            const context = this.canvas.getContext('2d');
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            context.drawImage(this.video, 0, 0);
            
            const imageData = this.canvas.toDataURL('image/jpeg', 1.0);
            return {
                image: imageData,
                faceData: predictions[0]
            };
        } catch (err) {
            this.showError('Ошибка при захвате лица: ' + err.message);
            throw err;
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
                this.showError('Камера остановлена');
            });
        }
    }
} 