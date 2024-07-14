import * as THREE from "three"
import { Environment } from "./physics/environment";

export class Submarine{
    
    constructor(
                environment,
                position = new THREE.Vector3(0 , 0 , 0),
                rotation = new THREE.Vector3(0 , 0 , 0),
                centerOfMass = new THREE.Vector3(0 , 0 , 0),
                velocity = new THREE.Vector3(0 , 0 , 0),
                acceleration = new THREE.Vector3(0 , 0 , 0),
                angularVelocity = new THREE.Vector3(0 , 0 , 0),
                angularAcceleration = new THREE.Vector3(0 , 0 , 0),
                angleHorizontalFrontPlane = new THREE.Vector3(0 , 0 , 0),
                angleHorizontalBackPlane = new THREE.Vector3(0 , 0 , 0),
                angleVerticalPlane = new THREE.Vector3(0 , 0 , 0),
                
                height = 10,
                radius = 1,
                netMass = 5000,
                tanksCapacity = 2000,
                volumeOfWaterInTanks = 0,
                enginePower = 1000,
                speedOfFan = 0,
                areaOfBackPlane = 10,
                areaOfFrontPlane = 10,
               
                distanceHorizontalFrontPlanesFromTheCenter = 0,
                distanceHorizontalBackPlanesFromTheCenter = 0,
                distanceVerticalPlanesFromTheCenter = 0) {
        this.environment                                = environment            
        this.position                                   = position;
        this.rotation                                   = rotation;
        this.velocity                                   = velocity;
        this.acceleration                               = acceleration;
        this.centerOfMass                               = centerOfMass;
        this.height                                     = height;
        this.radius                                     = radius;
        this.netMass                                    = netMass;
        this.tanksCapacity                              = tanksCapacity;
        this.volumeOfWaterInTanks                       = volumeOfWaterInTanks;
        this.enginePower                                = enginePower;
        this.speedOfFan                                 = speedOfFan;
        this.areaOfBackPlane                            = areaOfBackPlane;
        this.areaOfFrontPlane                           = areaOfFrontPlane;
        this.angularAcceleration                        = angularAcceleration;
        this.angularVelocity                            = angularVelocity;
        this.angleHorizontalFrontPlane                  = angleHorizontalFrontPlane;
        this.angleHorizontalBackPlane                   = angleHorizontalBackPlane;
        this.angleVerticalPlane                         = angleVerticalPlane;
        this.distanceHorizontalFrontPlanesFromTheCenter = distanceHorizontalFrontPlanesFromTheCenter;
        this.distanceHorizontalBackPlanesFromTheCenter  = distanceHorizontalBackPlanesFromTheCenter;
        this.distanceVerticalPlanesFromTheCenter        = distanceVerticalPlanesFromTheCenter;
    }
    
    getSubmarineInfo = () =>{
        return {...this}
    }

    /*     */
    
    calcLinearAcceleration = () => {
        const F_engine = this.enginePower;
        const F_drag_on_body = this.environment.calcDragOnBody(this)
        const F_resistance_h = this.environment.calcResistanceForceOnHorizontalPlanes(this)
        const F_resistance_v = this.environment.calcResistanceForceOnVerticalPlanes(this)
        const F_resistance = F_resistance_h.add(F_resistance_v)

        const W = this.environment.calcWeightForce(this).length()
        const F_buoyancy = this.environment.calcArchimedesForce(this).length()

        const ax = (F_engine.x - F_drag_on_body.x - Environment.PRESSURE.x - F_resistance.x) / (this.netMass + this.volumeOfWaterInTanks)
        const ay = (F_buoyancy - W - F_drag_on_body.y - Environment.PRESSURE.y - F_resistance.y) / (this.netMass + this.volumeOfWaterInTanks)
        const az = (F_drag_on_body.z - Environment.PRESSURE.z - F_resistance.z) / (this.netMass + this.volumeOfWaterInTanks)
        
        this.acceleration = new THREE.Vector3(ax , ay , az)
        return this.acceleration


    }
    calcNextVelocity = (deltaTime) => {
        const vx = this.velocity.x + this.acceleration.x * deltaTime
        const vy = this.velocity.y + this.acceleration.y * deltaTime
        const vz = this.velocity.z + this.acceleration.z * deltaTime
        this.velocity = new THREE.Vector3(vx , vy , vz)
        return this.velocity
    }
    calcNextLocation = (deltaTime) => {
        const x = this.location.x + this.velocity.x * deltaTime;
        const y = this.location.y + this.velocity.y * deltaTime;
        const z = this.location.z + this.velocity.z * deltaTime;
        return this.location = new THREE.Vector3(x , y , z)


    }
    LinearMotionInMoment = (deltaTime) => {
        this.calcLinearAcceleration()
        this.calcNextVelocity(deltaTime)
        this.calcNextLocation(deltaTime)
    }
    /*  */
    calcHorizontalAngularAccelerate = () => {
        const InertiaForce      = this.environment.calcMomentOfInertiaOfCylinder(this)
        const ResistanceForce_H = this.environment.calcResistanceForceOnHorizontalPlanes(this)
        const ResistanceForce_V = this.environment.calcResistanceForceOnVerticalPlanes(this)

        const total_forces = ResistanceForce_H.length() * ResistanceForce_H. 


        
    }
    calcNextHorizontalAngularVelocity = (deltaTime) => {
        const wx = this.angularVelocity.x + this.angularAcceleration.x * deltaTime
        const wy = this.angularVelocity.y + this.angularAcceleration.y * deltaTime
        const wz = this.angularVelocity.z + this.angularAcceleration.z * deltaTime

        this.angularVelocity = new THREE.Vector3(wx , wy , wz)
        return this.angularVelocity
    }
    calcNextHorizontalAngel = () => {
        
    }
    calcHorizontalAngularMotionInMoment = () => {
    }

    /*  */
    calcVerticalAngularAccelerate = () => {

    }
    calcNextVerticalAngularVelocity = () => {

    }
    calcNextVerticalAngel = () => {

    }
    calcVerticalAngularMotionInMoment = () => {

    }


    
}