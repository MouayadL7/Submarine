import * as THREE from "three"
import { Environment } from "./physics/environment";

export class Submarine{
    
    constructor(
        environment                                 = null,
        position                                    = null,
        rotation                                    = null,
        centerOfMass                                = null,
        velocity                                    = null,
        acceleration                                = null,
        angularVelocity                             = null,
        angularAcceleration                         = null,
        angleHorizontalFrontPlane                   = null,
        angleHorizontalBackPlane                    = null,
        angleVerticalPlane                          = null,
        height                                      = 10,
        radius                                      = 2,
        netMass                                     = 10000,
        tanksCapacity                               = 1000,
        volumeOfWaterInTanks                        = 0,
        enginePower                                 = 1000,
        maxSpeedOfFan                               = 60,
        speedOfFan                                  = 0,
        areaOfBackPlane                             = 2,
        areaOfFrontPlane                            = 2,
        distanceHorizontalFrontPlanesFromTheCenter  = 1,
        distanceHorizontalBackPlanesFromTheCenter   = 1,
        distanceVerticalPlanesFromTheCenter         = 1,
        phi_x                                       = 0,
        phi_y                                       = 0,
        phi_z                                       = 0
    ) {
        this.environment                                = environment || new Environment();
        this.position                                   = position || new THREE.Vector3(0, 0, 0);
        this.rotation                                   = rotation || new THREE.Vector3(0, 0, 0);
        this.velocity                                   = velocity || new THREE.Vector3(0, 0, 0);
        this.acceleration                               = acceleration || new THREE.Vector3(0, 0, 0);
        this.centerOfMass                               = centerOfMass || new THREE.Vector3(0, 0, 0);
        this.height                                     = height;
        this.radius                                     = radius;
        this.netMass                                    = netMass;
        this.tanksCapacity                              = tanksCapacity;
        this.volumeOfWaterInTanks                       = volumeOfWaterInTanks;
        this.enginePower                                = enginePower;
        this.maxSpeedOfFan                              = maxSpeedOfFan;
        this.speedOfFan                                 = speedOfFan;
        this.areaOfBackPlane                            = areaOfBackPlane;
        this.areaOfFrontPlane                           = areaOfFrontPlane;
        this.angularAcceleration                        = angularAcceleration || new THREE.Vector3(0, 0, 0);
        this.angularVelocity                            = angularVelocity || new THREE.Vector3(0, 0, 0);
        this.angleHorizontalFrontPlane                  = angleHorizontalFrontPlane || new THREE.Vector3(0, 0, 0);
        this.angleHorizontalBackPlane                   = angleHorizontalBackPlane || new THREE.Vector3(0, 0, 0);
        this.angleVerticalPlane                         = angleVerticalPlane || new THREE.Vector3(0, 0, 0);
        this.distanceHorizontalFrontPlanesFromTheCenter = distanceHorizontalFrontPlanesFromTheCenter;
        this.distanceHorizontalBackPlanesFromTheCenter  = distanceHorizontalBackPlanesFromTheCenter;
        this.distanceVerticalPlanesFromTheCenter        = distanceVerticalPlanesFromTheCenter;
        this.phi_x                                      = phi_x;
        this.phi_y                                      = phi_y;
        this.phi_z                                      = phi_z;

        
    }

    
    getSubmarineInfo = () =>{
        console.log('Submarine properties:', {
            environment: this.environment,
            position: this.position,
            rotation: this.rotation,
            velocity: this.velocity,
            acceleration: this.acceleration,
            centerOfMass: this.centerOfMass,
            angularAcceleration: this.angularAcceleration,
            angularVelocity: this.angularVelocity,
            angleHorizontalFrontPlane: this.angleHorizontalFrontPlane,
            angleHorizontalBackPlane: this.angleHorizontalBackPlane,
            angleVerticalPlane: this.angleVerticalPlane,
            height: this.height,
            radius: this.radius,
            netMass: this.netMass,
            tanksCapacity: this.tanksCapacity,
            volumeOfWaterInTanks: this.volumeOfWaterInTanks,
            enginePower: this.enginePower,
            maxSpeedOfFan: this.maxSpeedOfFan,
            speedOfFan: this.speedOfFan,
            areaOfBackPlane: this.areaOfBackPlane,
            areaOfFrontPlane: this.areaOfFrontPlane,
            distanceHorizontalFrontPlanesFromTheCenter: this.distanceHorizontalFrontPlanesFromTheCenter,
            distanceHorizontalBackPlanesFromTheCenter: this.distanceHorizontalBackPlanesFromTheCenter,
            distanceVerticalPlanesFromTheCenter: this.distanceVerticalPlanesFromTheCenter,
            phi_x: this.phi_x,
            phi_y: this.phi_y,
            phi_z: this.phi_z,
        });
    }

    /*     */
    
    calcLinearAcceleration = () => {
        const F_engine = this.environment.calcEngineForce(this)
        const F_drag_on_body = this.environment.calcResistanceOnBody(this)
        const F_resistance_h = this.environment.calcResistanceForceOnHorizontalPlanes(this)
        const F_resistance_v = this.environment.calcResistanceForceOnVerticalPlanes(this)
        const F_resistance = F_resistance_h.add(F_resistance_v)
        const W = this.environment.calcWeightForce(this).length()
        const F_buoyancy = this.environment.calcArchimedesForce(this).length()
        
        const ax = (F_engine.x - F_drag_on_body.x - F_resistance.x) / (this.netMass + this.volumeOfWaterInTanks)
        const ay = (F_buoyancy - W - F_drag_on_body.y - F_resistance.y) / (this.netMass + this.volumeOfWaterInTanks)
        const az = (F_drag_on_body.z - F_resistance.z) / (this.netMass + this.volumeOfWaterInTanks)
        console.log("Acceleration" , {
            "net mass": this.netMass,
            'volume of water in tanks': this.volumeOfWaterInTanks,
            "F_engine": F_engine,
            "F_drag_on_body":F_drag_on_body,
            "F_resistance_h":F_resistance_h,
            "F_resistance_v":F_resistance_v,
            "F_resistance":F_resistance,
            'Weight Force': W , 
            'F_buoyancy': F_buoyancy,
        })
        this.acceleration.set(ax , ay , az)
    }
    calcNextVelocity = (deltaTime) => {
        console.log("Next Velocity" , {
            "Delta Time": deltaTime
        })
        /* const vx = this.velocity.x + this.acceleration.x * deltaTime
        const vy = this.velocity.y + this.acceleration.y * deltaTime
        const vz = this.velocity.z + this.acceleration.z * deltaTime
        this.velocity.set(vx , vy , vz)
         */
        this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime))
        // return this.velocity
    }
    calcNextLocation = (deltaTime) => {
        // const x = this.position.x + this.velocity.x * deltaTime;
        // const y = this.position.y + this.velocity.y * deltaTime;
        // const z = this.position.z + this.velocity.z * deltaTime;
        // this.position.set(x , y , z)
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    }
    LinearMotionInMoment = (deltaTime) => {
        this.calcLinearAcceleration()
        this.calcNextVelocity(deltaTime)
        this.calcNextLocation(deltaTime)
    }
    /*  */
    
    calcAngularAccelerate = () =>{
        const InertiaForce      = this.environment.calcMomentOfInertiaOfCylinder(this)
        const ResistanceForce_H = this.environment.calcResistanceForceOnHorizontalPlanes(this , true)
        const ResistanceForce_V = this.environment.calcResistanceForceOnVerticalPlanes(this , true)

        const Moment_z = this.distanceHorizontalBackPlanesFromTheCenter * ResistanceForce_H * Math.sin(this.phi_z)
        const Moment_y = this.distanceVerticalPlanesFromTheCenter * ResistanceForce_V * Math.sin(this.phi_y)

        this.angularAcceleration = new THREE.Vector3(0 , Moment_y / InertiaForce[1][1] , Moment_z / InertiaForce[2][2])

        // return this.angularAcceleration
        // return Moment_z / InertiaForce[2][2]
    }
    calcAngularVelocity = (deltaTime) => {
        const wx = this.angularVelocity.x + this.angularAcceleration.x * deltaTime
        const wy = this.angularVelocity.y + this.angularAcceleration.y * deltaTime
        const wz = this.angularVelocity.z + this.angularAcceleration.z * deltaTime

        this.angularVelocity = new THREE.Vector3(wx , wy , wz)
        return this.angularVelocity
    }

    
    
    calcNextAngel = (deltaTime) => {
        const x = this.rotation.x + this.angularVelocity.x * deltaTime; 
        const y = this.rotation.y + this.angularVelocity.y * deltaTime; 
        const z = this.rotation.z + this.angularVelocity.z * deltaTime; 
        this.rotation.set(x , y , z)
    }
    AngularMotionInMoment = (deltaTime) => {
        this.calcAngularAccelerate()
        this.calcAngularVelocity(deltaTime)
        this.calcNextAngel(deltaTime)
    }


    
}