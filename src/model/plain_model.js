import * as THREE from 'three';

export class PlainModel {
     pl;
     geometry;
    constructor({
        color,
        side,
        transparent,
        opacity,
        texture,
        width,
        height,
        widthSegments,
        heightSegments,
        rotationX,
        position
    }) {
        this.material = new THREE.MeshBasicMaterial({
            color: color,
            side: side,
            transparent: transparent,
            opacity: opacity,
            map: texture
        });

        this.geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
        this.pl = new THREE.Mesh(this.geometry, this.material);
        this.pl.rotation.x = rotationX;
        this.pl.position.set(position.x, position.y, position.z);
    }

    getPlain() {
        return this.pl;
    }
}
