class FaceIDHandler {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.stream = null;
        this.model = null;
    }

    async initCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Ваше устройство не поддерживает доступ к камере');
        }

        this.video = document.createElement('video');
        this.canvas = document.createElement('canvas');
        
        this.video.setAttribute('playsinline', '');
        this.video.setAttribute('autoplay', '');
        this.video.style.width = '100%';
        this.video.style.height = '100%';
        this.video.style.objectFit = 'cover';

        try {
            this.model = await blazeface.load();
            console.log('Модель загружена');
            
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            console.log('Доступ к камере получен');

            this.video.srcObject = this.stream;
            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.play().then(resolve);
                };
            });
        } catch (err) {
            console.error("Ошибка инициализации камеры:", err);
            throw new Error(err.message || 'Ошибка доступа к камере');
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