import "./style.css";
import { Environment } from './physics/environment.js'
import  { Submarine } from './submarine.js'
import * as THREE from "three";


import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from 'dat.gui';
import { SubmarineModel } from './model/submarine_model.js';
import { SkyBoxModel } from "./model/sky_box_model.js";
import { PlainModel } from './model/plain_model.js'; 
import { KeysController } from "./controller/keys_controller.js";

const canvas = document.getElementById("scene");
const cubeTextureLoader = new THREE.CubeTextureLoader();
const scene = new THREE.Scene();



const gui = new GUI();
// Environment Debug:
const envDebugFolder = gui.addFolder('environment')
const gravityFolder = envDebugFolder.addFolder("Gravity")
const pressureFolder = envDebugFolder.addFolder("Pressure")

gravityFolder.add(Environment.GRAVITY , 'x' , -20 , 20 , 0.01)
    .onChange((newValue) => {
        Environment.GRAVITY.x = newValue
    })
gravityFolder.add(Environment.GRAVITY , 'y' , -20 , 20 , 0.01)
    .onChange((newValue) => {
        Environment.GRAVITY.y = newValue
    })
gravityFolder.add(Environment.GRAVITY , 'z' , -20 , 20 , 0.01)
    .onChange((newValue) => {
        Environment.GRAVITY.z = newValue
    })

pressureFolder.add(Environment.PRESSURE , 'x' ,0 , 1000 , 1)
    .onChange((newValue) => {
        Environment.PRESSURE.x = newValue
    })
pressureFolder.add(Environment.PRESSURE , 'y' , 0 , 1000 , 1)
.onChange((newValue) => {
    Environment.PRESSURE.y = newValue
})
pressureFolder.add(Environment.PRESSURE , 'z' , 0 , 1000 , 1)
.onChange((newValue) => {
    Environment.PRESSURE.z = newValue
})
const env = new Environment()
const s = new Submarine(env)
s.calcLinearAcceleration()

envDebugFolder
        .add(Environment , 'DENSITY_OF_LIQUID' , 1000 , 1050)
        .name('DensityOfWater')
        .onChange( (newValue) => {
            Environment.DENSITY_OF_LIQUID = newValue
        })
envDebugFolder
        .add(Environment , 'FRICTION' , 0 , 10 , 0.01)
        .name('Friction')
        .onChange( (newValue) =>{
            Environment.FRICTION = newValue
        })



/* Objects based on submarine */
// console.log(physics.getSubmarineInfo())

let x = new Submarine()
// console.log(x.getSubmarineInfo())

// TO REMOVE:
const info = {
    waterDensity: 1000,
    motorForce: 1000000,
    cl: 1,
    angle: 0
}
// gui objects
gui.add(info, 'cl', 0, 4)
gui.add(info, 'motorForce', 0, 1200000);
gui.add(info, 'waterDensity', 1, 4);
gui.add(info, 'angle', -0.2, 0.2);

// Space box
THREE.BoxGeometry
const environmentMap = cubeTextureLoader.load([
    "assets/textures/scene.jpg",
    "assets/textures/scene.jpg",
    "assets/textures/scene.jpg",
    "assets/textures/scene.jpg",
    "assets/textures/scene.jpg",
    "assets/textures/scene.jpg"
]);
scene.background = environmentMap;

// Camera:
const camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    0.1,
    1000000000
);

// Renderer:
const renderer = new THREE.WebGLRenderer({
    canvas,
});

// Controls:
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
const skyBox = new SkyBoxModel(0x001123, THREE.DoubleSide, true, 0.7,2000);
const cube = new THREE.Mesh(skyBox.getCubeGeometry(), skyBox.getSkyBox());
cube.position.y = -10060;
scene.add(cube);

/* PLAIN-WAVES */
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/assets/textures/blue_ocean.jpg");
const plain = new PlainModel({color: 0x04d7e1,side: THREE.DoubleSide,transparent: true,opacity: 0.7,texture: texture,
    width: 20000,height: 20000,widthSegments: 500,heightSegments: 500,rotationX: Math.PI / 2,position: { x: 0, y: -50, z: 0 }
});
scene.add(plain.getPlain());

/* SUBMARINE */
const plainPosition = { x:plain.pl.position.x, y: plain.pl.position.y, z:plain.pl.position.z - 100 };
const submarine = new SubmarineModel('models/scene.gltf',plainPosition);
scene.add(submarine.getSubmarine());

/* FOG */
const fogColor = new THREE.Color(0x001123); // Deep water color
scene.fog = new THREE.Fog(fogColor, 50, 2000);

// Window resizing
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
    // to handle A, D, UP and DOWN keys:
    window.addEventListener('keydown' , (event) =>{
        
        const key = event.key
        console.log(key)
         /* start to fill the tanks, the rotation gonna be on the
         z axes by 0.1.
         here there are two cases:
         1- when the tanks are full:
            I can't rotate anymore on the z axes
         2- when the tans aren't full:
            Increase the rotation by factor of 0.1
        
         */
        if(key == 'ArrowUp')
        {
            
        }
        
    })

};

const render = () => {
    controls.update();
    renderer.render(scene, camera);
};
// Camera
const key = new KeysController(camera,controls,2);
var time = 0;
init();

export const main = () => {
    var vertices = plain.geometry.attributes.position.array;
    for (var i = 0; i < vertices.length; i += 3) {
        var x = vertices[i];
        var y = vertices[i + 1];
        vertices[i + 2] = Math.sin((x + y + time) * 0.2) * 8;
    }
    plain.geometry.attributes.position.needsUpdate = true;
    time += 0.4;

    window.requestAnimationFrame(main);
    key.moveCamera();
    render();
};
main();

