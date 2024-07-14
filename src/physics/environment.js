import * as THREE from 'three'
import { sub } from 'three/examples/jsm/nodes/Nodes.js'
export class Environment{
    constructor(){}

    static GRAVITY = new THREE.Vector3(0 , -9.81 , 0)
    static DENSITY_OF_LIQUID = 1000
    static FRICTION = 1
    static PRESSURE = new THREE.Vector3(0 , 0 , 0)

    calcWeightForce =  (submarine) => {
        const w = new THREE.Vector3(0 , -submarine.NetMass * this.GRAVITY , 0)
        return w 
    }
    calcEngineForce = (submarine) => {
        const F = submarine.enginePower * submarine.speedOfFane
        return new THREE.Vector3(F , 0 , 0)
    }
    calcArchimedesForce = (submarine) => {
        // Remember, this force must be applied in the center of mess of the submarine
        // which is in our program the center of the submarine:
        const F = Environment.DENSITY_OF_LIQUID * Environment.GRAVITY * this.calcCylinderVolume(submarine.radius)
        return new THREE.Vector3(0 , F , 0)
    }

    calcDragOnBody = (submarine) => {
        console.log(Environment.PRESSURE)
        const area = this.calcCylinderArea(submarine)
        // to get the speed of the submarine, we can get the magnitude of the vector of the velocity:
        // which can be done by using length() function in three.js
        
        const speed = submarine.velocity.length()
        const F_drag_x = (Environment.FRICTION + Environment.PRESSURE.x) * 0.5 * area * speed * submarine.velocity.x * Environment.DENSITY_OF_LIQUID
        const F_drag_y = (Environment.FRICTION + Environment.PRESSURE.y) * 0.5 * area * speed * submarine.velocity.y * Environment.DENSITY_OF_LIQUID
        const F_drag_z = (Environment.FRICTION + Environment.PRESSURE.z) * 0.5 * area * speed * submarine.velocity.z * Environment.DENSITY_OF_LIQUID

        return new THREE.Vector3(F_drag_x , F_drag_y , F_drag_z)
    }
    calcResistanceForceOnBody = (submarine) => {
        const area = this.calcCylinderArea(submarine)
        // to get the speed of the submarine, we can get the magnitude of the vector of the velocity:
        // which can be done by using length() function in three.js
        
        const speed = submarine.velocity.length()
        const F_resistance_x = Environment.FRICTION * 0.5 * area * speed * submarine.velocity.x * Environment.DENSITY_OF_LIQUID
        const F_resistance_y = Environment.FRICTION * 0.5 * area * speed * submarine.velocity.y * Environment.DENSITY_OF_LIQUID
        const F_resistance_z = Environment.FRICTION * 0.5 * area * speed * submarine.velocity.z * Environment.DENSITY_OF_LIQUID

        return new THREE.Vector3(F_resistance_x , F_resistance_y , F_resistance_z)
    }
    calcResistanceForceOnHorizontalPlanes = (submarine) => {
        const area  = submarine.areaOfFrontPlane
        const speed = submarine.velocity.length()
        const F_resistance_x = Environment.FRICTION * 0.5 * area * speed * submarine.velocity.x * Environment.DENSITY_OF_LIQUID
        const F_resistance_y = Environment.FRICTION * 0.5 * area * speed * submarine.velocity.y * Environment.DENSITY_OF_LIQUID
        const magnitude_xy = new THREE.Vector3(F_resistance_x , F_resistance_y , 0).length()

        return new THREE.Vector3(magnitude_xy * Math.cos(submarine.rotation.x) , magnitude_xy * Math.sin(submarine.rotation.x) , 0)
    }

    calcResistanceForceOnVerticalPlanes = (submarine) => {
        const area  = submarine.areaOfBackPlane
        const speed = submarine.velocity.length()
        const F_resistance_x = Environment.FRICTION * 0.5 * area * speed * submarine.velocity.x * Environment.DENSITY_OF_LIQUID
        const F_resistance_z = Environment.FRICTION * 0.5 * area * speed * submarine.velocity.z * Environment.DENSITY_OF_LIQUID
    
        const magnitude_xz =  new THREE.Vector3(F_resistance_x , 0 , F_resistance_z).length()
        return new THREE.Vector3(magnitude_xz * Math.cos(submarine.rotation.x) , 0 , magnitude_xz * Math.sin(submarine.rotation.x))

    }
    calcMomentOfInertiaOfCylinder = (submarine) => {
        // Check if the mass should be with the mass of water in the tanks or not
        const m = submarine.netMass
        const h = submarine.height
        const r = submarine.radius
        const res = [
            [m * r * r * 0.5 , 0 , 0],
            [0 , 1/12 * m * (3 * r * r + h * h) , 0],
            [0 , 0 , 1/12 * m * (3 * r * r + h * h)]
        ]
        return res 
    }
    calcCylinderArea = (submarine) => {
        return 2 * Math.PI * submarine.radius * submarine.height + 2 * Math.PI * submarine.radius * submarine.radius
    }
    calcCylinderVolume = (submarine) => {
        return Math.PI * submarine.radius * submarine.radius * submarine.height 
    }

}
