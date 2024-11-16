class FaceIDHandler {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.stream = null;
        this.model = null;
    }

    async initCamera() {
        if (typeof blazeface === 'undefined') {
            throw new Error('Библиотека BlazeFace не загружена');
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Ваше устройство не поддерживает доступ к камере');
        }

        try {
            console.log('Загрузка модели...');
            this.model = await blazeface.load();
            console.log('Модель успешно загружена');

            this.video = document.createElement('video');
            this.canvas = document.createElement('canvas');
            
            this.video.setAttribute('playsinline', '');
            this.video.setAttribute('autoplay', '');
            this.video.style.width = '100%';
            this.video.style.height = '100%';
            this.video.style.objectFit = 'cover';

            console.log('Запрос доступа к камере...');
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                },
                audio: false
            });
            console.log('Доступ к камере получен');

            this.video.srcObject = this.stream;
            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    console.log('Видео метаданные загружены');
                    this.video.play()
                        .then(() => {
                            console.log('Видео запущено');
                            resolve();
                        })
                        .catch(error => {
                            console.error('Ошибка запуска видео:', error);
                            throw error;
                        });
                };
            });
        } catch (err) {
            console.error("Подробная ошибка инициализации:", err);
            throw new Error(`Ошибка доступа к камере: ${err.message}`);
        }
    }

    async captureFace() {
        if (!this.video || !this.model) {
            throw new Error('Камера не инициализирована');
        }

        try {
            const predictions = await this.model.estimateFaces(this.video, false);
            
            if (predictions.length === 0) {
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
            console.error("Ошибка при захвате лица:", err);
            throw err;
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
                console.log('Камера остановлена');
            });
        }
    }
} 