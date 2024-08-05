export class KeysController{
    controls;
    camera;
    keys;
    speed;
    constructor(camera, controls, speed = 2) {
        this.camera = camera;
        this.controls = controls;
        this.speed = speed;
        this.keys = {};

        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(event) {
        this.keys[event.code] = true;
    }

    onKeyUp(event) {
        this.keys[event.code] = false;
    }

    moveCamera() {
        // if (this.keys['ArrowUp'] || this.keys['KeyW']) {
        //     this.camera.position.z -= this.speed;
        // }
        // if (this.keys['ArrowDown'] || this.keys['KeyS']) {
        //     this.camera.position.z += this.speed;
        // }
        // if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
        //     this.camera.position.x -= this.speed;
        // }
        // if (this.keys['ArrowRight'] || this.keys['KeyD']) {
        //     this.camera.position.x += this.speed;
        // }

        // Update camera based on mouse movement
        this.controls.update();
    }
}