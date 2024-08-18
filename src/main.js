import "./style.css";
import { Environment } from './physics/environment.js'
import  { Submarine } from './submarine.js'
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from 'dat.gui';
import { SubmarineModel } from './model/submarine_model.js';
import { IslandModel } from './model/island_model.js'
import { SkyBoxModel } from "./model/sky_box_model.js";
import { PlainModel } from './model/plain_model.js'; 
import { KeysController } from "./controller/keys_controller.js";
import { sub } from "three/examples/jsm/nodes/Nodes.js";

const canvas = document.getElementById("scene");
const cubeTextureLoader = new THREE.CubeTextureLoader();
const scene = new THREE.Scene();



const gui = new GUI();
// Environment Debug:
const envDebugFolder = gui.addFolder('environment')
const submarineDebugFolder = gui.addFolder('submarine')



// submarineDebugFolder

// const env = new Environment()
const Submarine_Physics = new Submarine()
Submarine_Physics.position.set(0 , 0 , 0)
Submarine_Physics.getSubmarineInfo()
// return ;
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
envDebugFolder
.add(Environment , 'PRESSURE' , 0 , 10 , 0.01)
.name('Pressure')
.onChange( (newValue) =>{
    Environment.PRESSURE = newValue
})
envDebugFolder
.add(Environment , 'GRAVITY' , 0 , 20 , 0.01)
.name('Gravity')
.onChange( (newValue) =>{
    Environment.GRAVITY = newValue
})

submarineDebugFolder.add(Submarine_Physics , 'height' , 0.5 , 10 , 0.1)
submarineDebugFolder.add(Submarine_Physics , 'radius' , 0.2 , 10 , 0.01)
submarineDebugFolder.add(Submarine_Physics , 'tanksCapacity' , 10000 , 1000000 , 1)
.name('Tanks Capacity')
submarineDebugFolder.add(Submarine_Physics , 'netMass' , 500 , 10000 , 1)
.name('Net Mass')
submarineDebugFolder.add(Submarine_Physics , 'enginePower' , 100 , 10000)
.name('Engine Power')
submarineDebugFolder.add(Submarine_Physics , 'areaOfBackPlane' , 0 , 10)
.name('Area Of Back Plane')
submarineDebugFolder.add(Submarine_Physics , 'areaOfFrontPlane' , 0 , 10)
    .name('Area Of Front Plane')
    submarineDebugFolder.add(Submarine_Physics , 'distanceHorizontalFrontPlanesFromTheCenter' , 0 , 10)
    .name('The Distance Of The Horizontal Front Planes From The Center')
    
    submarineDebugFolder.add(Submarine_Physics , 'distanceHorizontalBackPlanesFromTheCenter' , 0 , 10)
    .name('The Distance Of The Horizontal Back Planes From The Center')     
    
    submarineDebugFolder.add(Submarine_Physics , 'distanceVerticalPlanesFromTheCenter' , 0 , 10)
    .name('The Distance Of The Vertical Planes From The Center')     
    
    /* Objects based on submarine */
    // console.log(physics.getSubmarineInfo())
    
    
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

var stats= new Stats()

const container = document.getElementById("container");
container.appendChild(renderer.domElement);
container.appendChild(stats.dom);
const infoDev = document.createElement('div')
infoDev.className = 'infoDev'

const info = {
    "Engine_Force" : null,
    "Position_x": null,
    "Position_y": null,
    "Position_z": null,
    
    "Rotation_x": null,
    "Rotation_y": null,
    "Rotation_z": null,


    "Speed_Of_Fans": null,
    "Volume_Of_Water": 0,
    
    'Speed_on_x': 0,
    'Speed_on_y': 0,
    'Speed_on_z': 0,

    'Acceleration_x':0,
    'Acceleration_y':0,
    'Acceleration_z':0,

    'buoyancy':0,
    'weight':0,
    'angleHorizontalFrontPlane':0
}

Object.keys(info).forEach(function (element) {
    info[element] = document.createElement('h6');
    info[element].className = 'infoText'


    infoDev.appendChild(info[element]);
    const div = document.createElement('hr')
    infoDev.appendChild(div)
});
container.appendChild(infoDev)


// Controls:
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.maxPolarAngle = Math.PI;
const textureLoader = new THREE.TextureLoader();

/* Lighting */
const ambientLight = new THREE.AmbientLight(0xffcc88, 0.7); // Sunset color
const directionalLight = new THREE.DirectionalLight(0xffcc88, 0.4);
directionalLight.position.set(100, 100, 10);
scene.add(ambientLight, directionalLight);

/* SKYBOX*/
const skyBox = new SkyBoxModel(0x001123, THREE.DoubleSide, true, 0.7, 2000);
const cube = new THREE.Mesh(skyBox.getCubeGeometry(), skyBox.getSkyBox());
cube.position.y = -1010;
scene.add(cube);

// Step 1: Create the cube geometry
const size = 20000; // Size of the ocean cube
const geometry = new THREE.BoxGeometry(size, size, size);

// Step 2: Load the textures
const textureFront = textureLoader.load ('assets/textures/front.jpg');
const textureBack = textureLoader.load  ('assets/textures/back.jpg');
const textureLeft = textureLoader.load  ('assets/textures/left.jpg');
const textureRight = textureLoader.load ('assets/textures/right.jpg');
const textureTop = textureLoader.load('assets/textures/surface_resized.jpg');
const textureBottom = textureLoader.load('assets/textures/down.jpg');

// Step 3: Create materials with inverted normals
const materials = [
    new THREE.MeshBasicMaterial({ map: textureRight, side: THREE.BackSide }),  // Right side
    new THREE.MeshBasicMaterial({ map: textureLeft, side: THREE.BackSide }),   // Left side
    new THREE.MeshBasicMaterial({ map: textureTop, side: THREE.BackSide }),    // Top side
    new THREE.MeshBasicMaterial({ map: textureBottom, side: THREE.BackSide }), // Bottom side
    new THREE.MeshBasicMaterial({ map: textureFront, side: THREE.BackSide }),  // Front side
    new THREE.MeshBasicMaterial({ map: textureBack, side: THREE.BackSide })    // Back side
];

// Step 4: Create the cube with these materials
const oceanCube = new THREE.Mesh(geometry, materials);
oceanCube.position.y = -size/2

// Step 5: Add the cube to the scene
scene.add(oceanCube);



/* PLAIN-WAVES */
const texture = textureLoader.load("/assets/textures/blue_ocean.jpg");
const plain = new PlainModel({color: 0x04d7e1,side: THREE.DoubleSide,transparent: true,opacity: 0.7,texture: texture,
    width: 20000,height: 20000,widthSegments: 500,heightSegments: 500,rotationX: Math.PI / 2,position: { x: 0, y: 0, z: 0 }
});
scene.add(plain.getPlain());

/* SUBMARINE */
const plainPosition = { x:plain.pl.position.x, y: plain.pl.position.y, z:plain.pl.position.z};
const submarine = new SubmarineModel('models/scene.gltf',plainPosition);

submarine.group.rotateY(Math.PI)
scene.add(submarine.getSubmarine());

const submarineBox = new THREE.Box3().setFromObject(submarine.group);


/* ISLAND */
plainPosition.y += 40 ;
plainPosition.x = -2000 ;
plainPosition.z = 500 ;
const islands = [] 

for(let i = 0 ; i < 10 ; i++){
    plainPosition.x += 1000 ;
    const island = new IslandModel('models/low_poly_medieval_island/scene.gltf' , plainPosition);
    island.group.scale.set(100 , 100 , 100);
    scene.add(island.getIsland())
    islands.push(island)

}

const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
const audioPath = '/src/sounds/boom.mp3';
console.log("Loading audio from path:", audioPath);

audioLoader.load(audioPath, function(buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(false);
  sound.setVolume(0.5);
  console.log("Audio loaded successfully");
}, undefined, function(error) {
  console.error("An error occurred while loading the audio:", error);
});

// Play the sound
function playBoomSound() {
  sound.play();
}

/* CHECKING COLLISION BETWEEN THE SUBMARINE AND THE ISLANDS */

function checkCollision() {
    submarineBox.setFromObject(submarine.group);
    islands.forEach(island=> {
        const islandBox = new THREE.Box3().setFromObject(island.group);
        
        /* console.log("Submarine_Box" , submarineBox);
        console.log("IslandBox" , islandBox) */
        if (submarineBox.intersectsBox(islandBox)) {
            // Collision detected, trigger explosion
            triggerExplosion();
        }
    });
    
}
// Create a particle system for the explosion
function createExplosion(position) {
    const particles = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
  
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position.x + (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 10;
    }
  
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff0000,
      size: 2,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
  
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
  
    // Animate the particles
    const explosionDuration = 1; // seconds
    const startTime = performance.now();
  
    function animateExplosion() {
      const elapsedTime = (performance.now() - startTime) / 1000;
      if (elapsedTime < explosionDuration) {
        const positions = particles.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] *= 1.05; // Expand particles outward
          positions[i * 3 + 1] *= 1.05;
          positions[i * 3 + 2] *= 1.05;
        }
        particles.attributes.position.needsUpdate = true;
        requestAnimationFrame(animateExplosion);
      } else {
        scene.remove(particleSystem); // Remove particle system after explosion
      }
    }
  
    animateExplosion();
  }

function stopSubmarine() {
    Submarine_Physics.velocity.set(0, 0, 0); // Stop the submarine
    Submarine_Physics.acceleration.set(0, 0, 0);
    Submarine_Physics.angularVelocity.set(0, 0, 0);
    Submarine_Physics.angularAcceleration.set(0, 0, 0);
    
}
let stopChecking = false ;
  // Example usage: Trigger explosion at submarine's position
function triggerExplosion() {
    const submarinePosition = submarine.group.position.clone();
    stopSubmarine();
    scene.remove(submarine)
    createExplosion(submarinePosition);
    console.log("Boom! Submarine hit the island!");
    if(!stopChecking){
        alert("The submarine has exploded! Reload the page to start your journey again!!.");
        playBoomSound()
        stopChecking = true 
    }
    
    // stopChecking = true ;
    /* setTimeout(() => {
        alert("The submarine has exploded! The page will reload.");
        window.location.reload();
      }, 2000); // Adjust the delay as needed */
}
/* FOG */
const fogColor = new THREE.Color(0x001123); // Deep water color
scene.fog = new THREE.Fog(fogColor, 50, 20000);

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
    camera.position.set(-201.62052466212333 , 59.996158817663 , -0.21305663026041985);
    // camera.lookAt(submarine.group.position)

    // controls.update();
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("load", handleWindowResize);
};
let previous_time = Date.now() 

Submarine_Physics.rotation.y = -Math.PI / 2

submarine.group.rotation.set(0 ,  -Math.PI / 2 , 0)

console.log("Model:" , submarine.group)
console.log("Physics", Submarine_Physics)
// console.log("Submarine rotation" , submarine.group.rotation)
// Submarine_Physics.rotation.copy(submarine.group.rotation)

// to handle A, D, UP and DOWN keys:
let current_rotation = 0
window.addEventListener('keydown' , (event) =>{
        
    const key = event.key
    console.log(key)
    let fact = 1
    const max_rotation_speed = 180
    const max_rotation = Math.PI / 24 

    if(key == 'ArrowUp')

    {
        if(Submarine_Physics.angleHorizontalBackPlane <=0.34){
        Submarine_Physics.angleHorizontalBackPlane  += 0.1
        Submarine_Physics.angleHorizontalFrontPlane += 0.1
        Submarine_Physics.angularVelocity.z += 0.01
        }
        
        info["angleHorizontalFrontPlane"].textContent = 'angleHorizontalFrontPlane : ' + (Submarine_Physics.angleHorizontalFrontPlane * 100).toFixed(0)

    }
    if(key == 'ArrowDown')
    {
        if(Submarine_Physics.angleHorizontalBackPlane >=-0.34){
            Submarine_Physics.angleHorizontalBackPlane  -= 0.1
            Submarine_Physics.angleHorizontalFrontPlane -= 0.1
            Submarine_Physics.angularVelocity.z -= 0.01
        }
        info["angleHorizontalFrontPlane"].textContent = 'angleHorizontalFrontPlane : ' + (Submarine_Physics.angleHorizontalFrontPlane * 100).toFixed(0)

    }
    if(key == 'ArrowRight')
    {
        Submarine_Physics.angleVerticalPlane -= 0.1
        Submarine_Physics.angularVelocity.y  -= 0.01
    }
    if(key == 'ArrowLeft')
    {
        Submarine_Physics.angleVerticalPlane += 0.1
        Submarine_Physics.angularVelocity.y  += 0.01
    }
    if(key == 'A' || key == 'a')
    {
        Submarine_Physics.volumeOfWaterInTanks = Math.min(Submarine_Physics.tanksCapacity , Submarine_Physics.volumeOfWaterInTanks + 10000)
        info["Volume_Of_Water"].textContent = 'Volume_Of_Water : ' + Submarine_Physics.volumeOfWaterInTanks.toFixed(0)
    }
    if(key == 'D' || key == 'd')
    {
        Submarine_Physics.volumeOfWaterInTanks = Math.max(0, Submarine_Physics.volumeOfWaterInTanks - 10000)
        info["Volume_Of_Water"].textContent = 'Volume_Of_Water : ' + Submarine_Physics.volumeOfWaterInTanks.toFixed(0)

    }

    if(key == 'W' || key == 'w')
    {
        Submarine_Physics.speedOfFan = Math.min(Submarine_Physics.maxSpeedOfFan , Submarine_Physics.speedOfFan + 10)
    }
    if(key == 'S' || key == 's')
    {
        Submarine_Physics.speedOfFan = Math.max(-Submarine_Physics.maxSpeedOfFan , Submarine_Physics.speedOfFan - 10)
    }
        // const current_time = Date.now()
        // let deltaTime = (current_time - previous_time) / 1000
        // previous_time = current_time 
        // console.log(deltaTime)
        // deltaTime = 0.01
        // Submarine_Physics.LinearMotionInMoment(deltaTime , info , submarine)
        // Submarine_Physics.AngularMotionInMoment(deltaTime , info , submarine)
        // submarine.group.position.copy(Submarine_Physics.position)

        console.log("Camera:" , camera)
        console.log("Submarine_Model" , submarine)        
        Submarine_Physics. getSubmarineInfo()
})
const render = () => {
    renderer.render(scene, camera);
};
// Camera
var time = 0;
init();

let cameraOffset = new THREE.Vector3(-150 , 40 , 0)
export const main = () => {
    var vertices = plain.geometry.attributes.position.array;
    for (var i = 0; i < vertices.length; i += 3) {
        var x = vertices[i];
        var y = vertices[i + 1];
        vertices[i + 2] = Math.sin((x + y + time) * 0.2) * 8;
    }
    plain.geometry.attributes.position.needsUpdate = true;
    time += 0.4;
    if(!stopChecking){
    const current_time = Date.now()
    const deltaTime = (current_time - previous_time)/1000 
    previous_time = current_time 
    
    Submarine_Physics.LinearMotionInMoment(deltaTime , info , submarine)
    Submarine_Physics.AngularMotionInMoment(deltaTime , info , submarine , camera)
    
    Submarine_Physics.getSubmarineInfo()
    submarine.group.position.copy(Submarine_Physics.position)
    checkCollision();
    }else{
        triggerExplosion();
    }
    
    // const axesHelper = new THREE.AxesHelper(100)
    // scene.add(axesHelper)
    // controls.update()


   camera.lookAt(Submarine_Physics.position)
    camera.position.set(Submarine_Physics.position.x - 150, Submarine_Physics.position.y + 40, Submarine_Physics.position.z)

    const matrix = new THREE.Matrix4()
    matrix.makeRotationFromQuaternion(submarine.group.quaternion)
    let offset = cameraOffset.clone().applyMatrix4(matrix)
    offset.applyAxisAngle(new THREE.Vector3(0 , 1 , 0) , Math.PI/ 2)
    camera.position.copy(Submarine_Physics.position.clone().add(offset))
    window.requestAnimationFrame(main);
    render();
    stats.update()
};
main();

