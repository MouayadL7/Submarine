import "./style.css";
import { Environment } from './physics/environment.js'
import  { Submarine } from './submarine.js'
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from 'dat.gui';
import { SubmarineModel } from './model/submarine_model.js';
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


    "Angular_X": null,
    "Angular_Y": null,
    "Angular_Z": null,
    angle_X_back: null,
    angle_X_front: null,
    angle_Y      : null,
    angle_body   : null,
    
    "Speed_Of_Fans": null,
    "Volume_Of_Water": 0,
    "Phi_x": 0,
    "Phi_y": 0,
    "Phi_z": 0,
    
    'Speed_on_x': 0,
    'Speed_on_y': 0,
    'Speed_on_z': 0,

    'Acceleration_x':0,
    'Acceleration_y':0,
    'Acceleration_z':0,
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

/* PLAIN-WAVES */
const textureLoader = new THREE.TextureLoader();
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
    // camera.position.set(-201.62052466212333 , 59.996158817663 , -0.21305663026041985);
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
        Submarine_Physics.angleHorizontalBackPlane  += 0.1
        Submarine_Physics.angleHorizontalFrontPlane += 0.1
        Submarine_Physics.angularVelocity.z += 0.01

        // Submarine_Physics.rotation.z += 0.1 
        // Submarine_Physics.rotation.z  = Math.min(Submarine_Physics.rotation.z, fact)
        // // Submarine_Physics.position.y = Math.min(Submarine_Physics.position.y, 26);
        // info["rotation_z"].textContent = 'rotation_z : ' + Submarine_Physics.rotation.z.toFixed(0)

    }
    if(key == 'ArrowDown')
    {
        Submarine_Physics.angleHorizontalBackPlane  -= 0.1
        Submarine_Physics.angleHorizontalFrontPlane -= 0.1
        Submarine_Physics.angularVelocity.z -= 0.01
        // info["rotation_z"].textContent = 'rotation_z : ' + Submarine_Physics.rotation.z.toFixed(0)
    }
    if(key == 'ArrowRight')
    {
        // if(current_rotation < max_rotation)
        //     current_rotation += 20

        // submarine.group.rotation.z = (current_rotation / max_rotation_speed) * max_rotation
        Submarine_Physics.angleVerticalPlane -= 0.1
        Submarine_Physics.angularVelocity.y  -= 0.01
     //   Submarine_Physics.f = 1
        // info["rotation.y"].textContent = 'rotation_y : ' + Submarine_Physics.rotation.y.toFixed(0)

    }
    if(key == 'ArrowLeft')
    {
        Submarine_Physics.angleVerticalPlane += 0.1
        Submarine_Physics.angularVelocity.y  += 0.01
     //   Submarine_Physics.f = -1
        // if(current_rotation  > -max_rotation) 
        //     current_rotation -= 20
        // submarine.group.rotation.z = (current_rotation / max_rotation_speed) * max_rotation

        // info["rotation.y"].textContent = 'rotation_y : ' + Submarine_Physics.rotation.y.toFixed(0)
    }
    if(key == 'A' || key == 'a')
    {
        Submarine_Physics.volumeOfWaterInTanks = Math.min(Submarine_Physics.tanksCapacity , Submarine_Physics.volumeOfWaterInTanks + 100000)
        info["Volume_Of_Water"].textContent = 'Volume_Of_Water : ' + Submarine_Physics.volumeOfWaterInTanks.toFixed(0)
    }
    if(key == 'D' || key == 'd')
    {
        Submarine_Physics.volumeOfWaterInTanks = Math.max(0, Submarine_Physics.volumeOfWaterInTanks - 100000/2)
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
        // submarine.group.rotation.copy(Submarine_Physics.rotation)

        console.log("Camera:" , camera)
        console.log("Submarine_Model" , submarine)        
        Submarine_Physics. getSubmarineInfo()
})
const render = () => {
    // controls.update();
    renderer.render(scene, camera);
};
// Camera
// const key = new KeysController(camera,controls,2);
// camera.lookAt(submarine.group.position)
var time = 0;
init();


gui.add(submarine.group.rotation , 'x' , -10 , 10 , 0.01)
    .name('submarine_rotation_x')
    .onChange( () => {
        console.log("Camera AND submarine positions: " , {
            "camera position": camera.position,
            "camera rotation": camera.rotation,
        
            "submarine position": submarine.group.position,
            "submarine rotation": submarine.group.rotation
        })
    })
gui.add(submarine.group.rotation , 'y' , -10 , 10 , 0.01)
    .name('submarine_rotation_y')
    .onChange( () => {
        console.log("Camera AND submarine positions: " , {
            "camera position": camera.position,
            "camera rotation": camera.rotation,
        
            "submarine position": submarine.group.position,
            "submarine rotation": submarine.group.rotation
        })
    })
gui.add(submarine.group.rotation , 'z' , -10 , 10 , 0.01)
    .name('submarine_rotation_z')
    .onChange( () => {
        console.log("Camera AND submarine positions: " , {
            "camera position": camera.position,
            "camera rotation": camera.rotation,
        
            "submarine position": submarine.group.position,
            "submarine rotation": submarine.group.rotation
        })
})
    // camera.lookAt(submarine.group.position)
    
gui.add(Submarine_Physics , 'phi_x' , -10 , 10 , 0.1)
    .onChange( () => {
        Submarine_Physics.LinearMotionInMoment(0.1) 
        // Submarine_Physics.AngularMotionInMoment(0.1)
        submarine.group.position.copy(Submarine_Physics.position)
        // submarine.group.rotation.copy(Submarine_Physics.rotation)
        Submarine_Physics.getSubmarineInfo()

        }
    )
gui.add(Submarine_Physics , 'phi_y' , -10 , 10 , 0.1)
    .onChange( () => {
    Submarine_Physics.LinearMotionInMoment(0.1) 
    // Submarine_Physics.AngularMotionInMoment(0.1)
    submarine.group.position.copy(Submarine_Physics.position)
    // submarine.group.rotation.copy(Submarine_Physics.rotation)
    Submarine_Physics.getSubmarineInfo()

    }
)
gui.add(Submarine_Physics , 'phi_z' , -10 , 10 , 0.1)
    .onChange( () => {
    Submarine_Physics.LinearMotionInMoment(0.1) 
    // Submarine_Physics.AngularMotionInMoment(0.1)
    submarine.group.position.copy(Submarine_Physics.position)
    // submarine.group.rotation.copy(Submarine_Physics.rotation)
    Submarine_Physics.getSubmarineInfo()

    }
)
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

    const current_time = Date.now()
    const deltaTime = (current_time - previous_time)/1000 
    previous_time = current_time 
    
    Submarine_Physics.LinearMotionInMoment(deltaTime , info , submarine)
    Submarine_Physics.AngularMotionInMoment(deltaTime , info , submarine , camera)
    
    Submarine_Physics.getSubmarineInfo()
    submarine.group.position.copy(Submarine_Physics.position)
    // submarine.group.rotation.copy(Submarine_Physics.rotation)
    
    const axesHelper = new THREE.AxesHelper(100)
    scene.add(axesHelper)
    // controls.update()

    // const camera_offset = new THREE.Vector3(Submarine_Physics.position.x - 150, Submarine_Physics.position.y + 40, Submarine_Physics.position.z)
    // const camera_offset = new THREE.Vector3(Submarine_Physics.position.x - 150, Submarine_Physics.position.y + 40, Submarine_Physics.position.z)
    // const camera_position = new THREE.Vector3().copy(camera_offset).applyMatrix4(submarine.group.matrixWorld)
    // camera.position.copy(camera_position)
    // camera.lookAt(camera.position)

    camera.lookAt(Submarine_Physics.position)
    camera.position.set(Submarine_Physics.position.x - 150, Submarine_Physics.position.y + 40, Submarine_Physics.position.z)

    const matrix = new THREE.Matrix4()
    matrix.makeRotationFromQuaternion(submarine.group.quaternion)
    // camera.position.applyMatrix4(matrix)
    let offset = cameraOffset.clone().applyMatrix4(matrix)
    offset.applyAxisAngle(new THREE.Vector3(0 , 1 , 0) , Math.PI/ 2)
    camera.position.copy(Submarine_Physics.position.clone().add(offset))

    // camera.rotateY(submarine.group.rotation.y)

    window.requestAnimationFrame(main);
    // key.moveCamera();
    render();
    stats.update()

};
main();

