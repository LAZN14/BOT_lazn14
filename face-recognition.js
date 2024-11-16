class FaceIDHandler {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.stream = null;
    }

    async initCamera() {
        this.video = document.createElement('video');
        this.canvas = document.createElement('canvas');
        this.video.style.display = 'none';
        this.canvas.style.display = 'none';
        document.body.appendChild(this.video);
        document.body.appendChild(this.canvas);

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "user" } 
            });
            this.video.srcObject = this.stream;
            await this.video.play();
        } catch (err) {
            console.error("Ошибка доступа к камере:", err);
            throw err;
        }
    }

    async captureFace() {
        const context = this.canvas.getContext('2d');
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        context.drawImage(this.video, 0, 0);
        
        const imageData = this.canvas.toDataURL('image/jpeg');
        return imageData;
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        if (this.video) {
            document.body.removeChild(this.video);
        }
        if (this.canvas) {
            document.body.removeChild(this.canvas);
        }
    }
} 