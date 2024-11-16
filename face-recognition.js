class FaceIDHandler {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.stream = null;
        this.model = null;
    }

    async initCamera() {
        this.video = document.createElement('video');
        this.canvas = document.createElement('canvas');
        
        this.video.setAttribute('playsinline', '');
        this.video.setAttribute('autoplay', '');
        this.video.style.width = '100%';
        this.video.style.height = '100%';
        this.video.style.objectFit = 'cover';

        try {
            this.model = await blazeface.load();
            
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            this.video.srcObject = this.stream;
            await this.video.play();
        } catch (err) {
            console.error("Ошибка:", err);
            throw err;
        }
    }

    async captureFace() {
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
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }
} 