import * as THREE from 'three';

export class SkyBoxModel {
    constructor(color, side, transparent, opacity,space) {
        this.material = new THREE.MeshBasicMaterial({
            color: color,
            side: side,
            transparent: transparent,
            opacity: opacity
        });
        this.cubeGeometry = new THREE.BoxGeometry(space, space, space);
    }
    
    getSkyBox() {
        return this.material;
    }
    getCubeGeometry() {
        return this.cubeGeometry;
    }
}
