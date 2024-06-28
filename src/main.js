import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GUI } from 'dat.gui';
import { Goasa } from "./physic";
import { Vector } from "./Vector";

const canvas = document.getElementById("scene");

const cubeTextureLoader = new THREE.CubeTextureLoader();

const scene = new THREE.Scene();

const gui = new GUI();
/* Objects based on submarin */
const info = {
    waterDensity: 1000,
    motorForce: 1000000,
    cl: 1,
    angle: 0
}
//gui objects
gui.add(info, 'cl', 0, 4)
gui.add(info, 'motorForce', 0, 1200000);
gui.add(info, 'waterDensity', 1, 4);
gui.add(info, 'angle', -0.2, 0.2);
gui.add({ press: showInfo }, 'press')
function showInfo() {
    console.log(
        "speed is          : ", 0, "\n",
        "position           : ", 0, "\n",
        "speed in vertices  : ", 0, "\n",
        "mass               : ", 0, "\n",
        "w                  : ", 0, "\n",
        "force              : ", 0, "\n",
        "cl                 : ", 0, "\n"
    );
}
// Space box
const enviromantMap = cubeTextureLoader.load([
    "assets/textures/scene.jpg",
    "assets/textures/scene.jpg",
    "assets/textures/scene.jpg",
    "assets/textures/scene.jpg",
    "assets/textures/scene.jpg",
    "assets/textures/scene.jpg"
]);

scene.background = enviromantMap;

const camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    0.1,
    1000000000
);
const renderer = new THREE.WebGLRenderer({
    canvas,
});
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI;

/* Lighting */
const ambientLight = new THREE.AmbientLight(0xffcc88, 0.7); // Sunset color
const directionalLight = new THREE.DirectionalLight(0xffcc88, 0.4);
directionalLight.position.set(100, 100, 10);
scene.add(ambientLight, directionalLight);

/* SKYBOX*/
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0x001123,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
});

const cubeGeometry = new THREE.BoxGeometry(20000, 20000, 20000);
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.y = -10060;
scene.add(cube);

/* PLAIN-WAVES */
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/assets/textures/blue_ocean.jpg");

const plainMaterial = new THREE.MeshBasicMaterial({
    color: 0x04d7e1,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7,
    map: texture
});
const plainGeometry = new THREE.PlaneGeometry(20000, 20000, 500, 500);
const plain = new THREE.Mesh(plainGeometry, plainMaterial);
plain.rotation.x = Math.PI / 2;
plain.position.set(0, -50, 0);
scene.add(plain);

/* SUBMARINE */
const goasa = new Goasa(new Vector(plain.position.x, plain.position.y, plain.position.z - 100));
const group = new THREE.Group();
group.position.set(plain.position.x, plain.position.y, plain.position.z - 100);

// Load the GLTF model
const loader = new GLTFLoader();
loader.load('models/scene.gltf', (gltf) => {
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    group.add(gltf.scene); // Add the loaded model to the scene
});
scene.add(group);

/* FOG */
const fogColor = new THREE.Color(0x001123); // Deep water color
scene.fog = new THREE.Fog(fogColor, 50, 2000);

const handleWindowResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
};

const init = () => {
    camera.position.set(0, 0, 1);
    controls.update();

    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("load", handleWindowResize);
};

const render = () => {
    controls.update();
    renderer.render(scene, camera);
};

const keys = {};
window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});
window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

const moveCamera = () => {
    const speed = 2;

    if (keys['ArrowUp'] || keys['KeyW']) {
        camera.position.z -= speed;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        camera.position.z += speed;
    }
    if (keys['ArrowLeft'] || keys['KeyA']) {
        camera.position.x -= speed;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
        camera.position.x += speed;
    }

    // Update camera based on mouse movement
    controls.update();
};

var time = 0;
init();

export const main = () => {
    var vertices = plainGeometry.attributes.position.array;
    for (var i = 0; i < vertices.length; i += 3) {
        var x = vertices[i];
        var y = vertices[i + 1];
        vertices[i + 2] = Math.sin((x + y + time) * 0.2) * 8;
    }
    plainGeometry.attributes.position.needsUpdate = true;
    time += 0.4;
    window.requestAnimationFrame(main);
    moveCamera();
    render();

    /* phyiscs laws  */
    // goasa.move();
    // group.position.set(goasa.position.x, goasa.position.y, goasa.position.z )
};
main();