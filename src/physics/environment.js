import * as THREE from 'three'
import { sub } from 'three/examples/jsm/nodes/Nodes.js'
export class Environment{
    constructor(){}

    static GRAVITY = 9.81
    static DENSITY_OF_LIQUID = 1000
    static FRICTION = 0.002
    static PRESSURE = 0.002

    calcWeightForce =  (submarine) => {
        
        const w = new THREE.Vector3(0, (submarine.netMass + submarine.volumeOfWaterInTanks) * Environment.GRAVITY, 0)
        // const res = submarine.getRotatedForce(w)

        console.log('Weight Force' , {
            "W" : w,
        })
        return w
    }

    calcEngineForce = (submarine) => {
        const F = new THREE.Vector3(submarine.enginePower * submarine.speedOfFan, 0, 0) 
        // const res = submarine.getRotatedForce(F)

        console.log("Engine force" , {
            "Engine force": F,
        })
        
        return F ;
    }
    
    calcArchimedesForce = (submarine) => {
        // Remember, this force must be applied in the center of mess of the submarine
        // which is in our program the center of the submarine:
        let F = new THREE.Vector3(0, (submarine.netMass + submarine.volumeOfWaterInTanks) * Environment.GRAVITY, 0)

        // const res = submarine.getRotatedForce(new THREE.Vector3(0 , F , 0))
        
        console.log('Archimedes Function:' , {
            "radius": submarine.radius,
            'Density of Water': Environment.DENSITY_OF_LIQUID,
            'Gravity': Environment.GRAVITY,
            'F' : F,
        })
        return F ;
    }

    calcResistanceOnBody = (submarine) => {
        const area_z = 2 * submarine.radius * submarine.height
        const area_y = 2 * submarine.radius * submarine.height
        const area_x = Math.PI * submarine.radius * submarine.radius

        // to get the speed of the submarine, we can get the magnitude of the vector of the velocity:
        // which can be done by using length() function in three.js      
        const speed = submarine.velocity.length() 
        
        const F_drag_x = (Environment.FRICTION + Environment.PRESSURE) * 0.5  * area_x * submarine.velocity.x * speed  * Environment.DENSITY_OF_LIQUID 
        const F_drag_y = (Environment.FRICTION + Environment.PRESSURE) * 0.5  * area_y * submarine.velocity.y * speed  * Environment.DENSITY_OF_LIQUID 
        const F_drag_z = (Environment.FRICTION + Environment.PRESSURE) * 0.5  * area_z * submarine.velocity.z * speed  * Environment.DENSITY_OF_LIQUID 
        
        let res =  new THREE.Vector3(F_drag_x , F_drag_y , F_drag_z)
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

    calcResistanceForceOnHorizontalPlanes = (submarine, area, angle) => {
        const speed = submarine.velocity.length()

        const F_x = (Environment.PRESSURE + Environment.FRICTION) * 0.5 * area * submarine.velocity.x * speed * Environment.DENSITY_OF_LIQUID
        const F_y = (Environment.PRESSURE + Environment.FRICTION) * 0.5 * area * submarine.velocity.y * speed * Environment.DENSITY_OF_LIQUID

        const resistance_x = F_x * Math.sin(angle) * Math.sin(angle) + F_y * Math.cos(angle) * Math.sin(angle)
        const resistance_y = F_x * Math.sin(angle) * Math.cos(angle) + F_y * Math.cos(angle) * Math.cos(angle)


        console.log("ResistanceForceOnHorizontalPlanes" , {
            "area" : area , 
            "Fx": F_x,
            "Fy": F_y,
            "resistance_x": resistance_x,
            "resistance_y": resistance_y,
        })
        const resistance =  new THREE.Vector3(resistance_x , resistance_y , 0)
        return resistance
    }

    calcResistanceForceOnVerticalPlanes = (submarine ,area , angle) => {
        const speed = submarine.velocity.length()

        const F_x = (Environment.PRESSURE + Environment.FRICTION) * 0.5 * area * submarine.velocity.x * speed * Environment.DENSITY_OF_LIQUID
        const F_z = (Environment.PRESSURE + Environment.FRICTION) * 0.5 * area * submarine.velocity.z * speed * Environment.DENSITY_OF_LIQUID

        const resistance_x = F_x * Math.sin(angle) * Math.sin(angle) + F_z * Math.cos(angle) * Math.sin(angle)
        const resistance_z = F_x * Math.sin(angle) * Math.cos(angle) + F_z * Math.cos(angle) * Math.cos(angle)


        console.log("ResistanceForceOnHorizontalPlanes" , {
            "area" : area , 
            "Fx": F_x,
            "Fy": F_z,
            "resistance_x": resistance_x,
            "resistance_y": resistance_z,
        })
        const resistance =  new THREE.Vector3(resistance_x , 0 , resistance_z)
        return resistance
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
