import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class IslandModel {
    constructor(modelPath, position) {
        this.group = new THREE.Group();
        this.group.position.set(position.x, position.y, position.z);
        this.loadModel(modelPath);
    }
    setPosition(modelPath , position){
        this.group.position.set(position)
        this.loadModel(mod)
    }
    loadModel(modelPath) {
        const loader = new GLTFLoader();
        loader.load(modelPath, (gltf) => {
            gltf.scene.scale.set(0.1, 0.1, 0.1);
            this.group.add(gltf.scene);
        });
    }

    getIsland() {
        return this.group;
    }
}
