import * as THREE from 'three'
import { sub } from 'three/examples/jsm/nodes/Nodes.js'
export class Environment{
    constructor(){}

    static GRAVITY = 9.81
    static DENSITY_OF_LIQUID = 1000
    static FRICTION = 0.002
    static PRESSURE = 0.002

    calcWeightForce =  (submarine) => {
        
        const w = new THREE.Vector3(0 , (submarine.netMass + submarine.volumeOfWaterInTanks) * Environment.GRAVITY , 0)
        const res = submarine.getRotatedForce(w)

        console.log('Weight Force' , {
            "W" : w,
            "res": res
        })
        return res 
    }
    calcEngineForce = (submarine) => {
        const F = new THREE.Vector3(submarine.enginePower * submarine.speedOfFan , 0 , 0) 
        const res = submarine.getRotatedForce(F)
        return res ;
    }
    calcArchimedesForce = (submarine) => {
        // Remember, this force must be applied in the center of mess of the submarine
        // which is in our program the center of the submarine:
        const F = Environment.DENSITY_OF_LIQUID * Environment.GRAVITY * this.calcCylinderVolume(submarine)
        const res = submarine.getRotatedForce(new THREE.Vector3(0 , F , 0))

        console.log('Archimedes Function:' , {
            "radius": submarine.radius,
            'Density of Water': Environment.DENSITY_OF_LIQUID,
            'Gravity': Environment.GRAVITY,
            'F' : F,
            'res': res
        })
        return res ;
    }

    calcResistanceOnBody = (submarine) => {
        const area_x = Math.PI * submarine.radius * submarine.radius
        const area_y = 2 * submarine.radius * submarine.height
        const area_z = 2 * submarine.radius * submarine.height
        // to get the speed of the submarine, we can get the magnitude of the vector of the velocity:
        // which can be done by using length() function in three.js
        
        const speed = submarine.velocity.length() 

        
        const F_drag_x = (Environment.FRICTION + Environment.PRESSURE) * 0.5  * area_x * speed * submarine.velocity.x * Environment.DENSITY_OF_LIQUID 
        const F_drag_y = (Environment.FRICTION + Environment.PRESSURE) * 0.5  * area_y * speed * submarine.velocity.y * Environment.DENSITY_OF_LIQUID 
        const F_drag_z = (Environment.FRICTION + Environment.PRESSURE) * 0.5  * area_z * speed * submarine.velocity.z * Environment.DENSITY_OF_LIQUID 
        let res =  new THREE.Vector3(F_drag_x , F_drag_y , F_drag_z)
        res = submarine.getRotatedForce(res)
        console.log("Resistance on Body" , {
            "velocity": submarine.velocity ,
            'Friction': Environment.FRICTION,
            'Pressure': Environment.PRESSURE,
            'Density of Water': Environment.DENSITY_OF_LIQUID,
            "area" : { area_x , area_y , area_z},
            'speed': speed,
            'F_drag_x': F_drag_x,
            'F_drag_y': F_drag_y,
            'F_drag_z': F_drag_z,
            'Resistance': new THREE.Vector3(F_drag_x , F_drag_y , F_drag_z),
            'rotated_resistance' : res 
        })
        return res 
    }
    calcResistanceForceOnHorizontalPlanes = (submarine , onlyF_xy = false) => {
        const area  = submarine.areaOfBackPlane
        const speed = submarine.velocity.length()
        const F_resistance_x = (Environment.PRESSURE + Environment.FRICTION) * 0.5 * area * speed * submarine.velocity.x * Environment.DENSITY_OF_LIQUID
        const F_resistance_y = (Environment.PRESSURE + Environment.FRICTION) * 0.5 * area * speed * submarine.velocity.y * Environment.DENSITY_OF_LIQUID
        const magnitude_xy = new THREE.Vector3(F_resistance_x , F_resistance_y , 0).length()

        const F_xy = magnitude_xy * Math.cos(submarine.rotation.x)
        if(onlyF_xy) return F_xy
        // return new THREE.Vector3(F_resistance_x * Math.sin(submarine.rotation.x + submarine.phi_x) * Math.sin(submarine.rotation.x + submarine.phi_x) , F_resistance_y * Math.sin(submarine.rotation.x + submarine.phi_x) * Math.cos(submarine.rotation.x + submarine.phi_x) , 0)
        let res =  new THREE.Vector3(F_xy * Math.cos(submarine.phi_x) , F_xy * Math.sin(submarine.phi_x) , 0)
        res = submarine.getRotatedForce(res)
        return res 

    }

    calcResistanceForceOnVerticalPlanes = (submarine , onlyF_xz) => {
        const area  = submarine.areaOfFrontPlane
        const speed = submarine.velocity.length()
        const F_resistance_x = (Environment.PRESSURE + Environment.FRICTION) * 0.5 * area * speed * submarine.velocity.x * Environment.DENSITY_OF_LIQUID
        const F_resistance_z = (Environment.PRESSURE + Environment.FRICTION) * 0.5 * area * speed * submarine.velocity.z * Environment.DENSITY_OF_LIQUID
        const magnitude_xz = new THREE.Vector3(F_resistance_x , 0 , F_resistance_z).length()

        const F_xz = magnitude_xz * Math.cos(submarine.rotation.x)
        if(onlyF_xz) return F_xz 
        // return new THREE.Vector3(F_resistance_x * Math.sin(submarine.rotation.x + submarine.phi_x) * Math.sin(submarine.rotation.x + submarine.phi_x) , F_resistance_y * Math.sin(submarine.rotation.x + submarine.phi_x) * Math.cos(submarine.rotation.x + submarine.phi_x) , 0)
        let res =  new THREE.Vector3(F_xz * Math.cos(submarine.phi_x) , 0 ,  F_xz * Math.sin(submarine.phi_x))
        res = submarine.getRotatedForce(res)
        return res 
    }
    calcMomentOfInertiaOfCylinder = (submarine) => {
        // Check if the mass should be with the mass of water in the tanks or not
        const m = submarine.netMass + submarine.volumeOfWaterInTanks
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
        const F = Math.PI * submarine.radius * submarine.radius * submarine.height  
       /*  console.log("Cylinder Volume :" , {
            "PI" : Math.PI,
            "Radius": submarine.radius,
            "height": submarine.height,
            'F':F
        }) */
        return F
    }

}
