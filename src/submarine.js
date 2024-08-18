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
        angleHorizontalFrontPlane                   = 0,
        angleHorizontalBackPlane                    = 0,
        angleVerticalPlane                          = 0,
        height                                      = 10,
        radius                                      = 2,
        netMass                                     = 100000,
        tanksCapacity                               = 1000000,
        volumeOfWaterInTanks                        = 0,
        enginePower                                 = 1000,
        maxSpeedOfFan                               = 1000,
        speedOfFan                                  = 0,
        areaOfBackPlane                             = 2,
        areaOfFrontPlane                            = 2,
        distanceHorizontalFrontPlanesFromTheCenter  = 1,
        distanceHorizontalBackPlanesFromTheCenter   = 1,
        distanceVerticalPlanesFromTheCenter         = 1,
        phi_x                                       = 0,
        phi_y                                       = 0,
        phi_z                                       = 0,
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
        this.frontTanksCapacity                         = 0
        this.backTanksCapacity                          = 0
        this.volumeOfWaterInTanks                       = volumeOfWaterInTanks;
        this.enginePower                                = enginePower;
        this.maxSpeedOfFan                              = maxSpeedOfFan;
        this.speedOfFan                                 = speedOfFan;
        this.areaOfBackPlane                            = areaOfBackPlane;
        this.areaOfFrontPlane                           = areaOfFrontPlane;
        this.angularAcceleration                        = angularAcceleration || new THREE.Vector3(0, 0, 0);
        this.angularVelocity                            = angularVelocity || new THREE.Vector3(0, 0, 0);
        this.angleHorizontalFrontPlane                  = angleHorizontalFrontPlane
        this.angleHorizontalBackPlane                   = angleHorizontalBackPlane
        this.angleVerticalPlane                         = angleVerticalPlane
        this.distanceHorizontalFrontPlanesFromTheCenter = distanceHorizontalFrontPlanesFromTheCenter;
        this.distanceHorizontalBackPlanesFromTheCenter  = distanceHorizontalBackPlanesFromTheCenter;
        this.distanceVerticalPlanesFromTheCenter        = distanceVerticalPlanesFromTheCenter;
        this.phi_x                                      = phi_x;
        this.phi_y                                      = phi_y;
        this.phi_z                                      = phi_z;
        this.total_force                                = new THREE.Vector3(0, 0, 0)
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

    calcLinearAcceleration = (info , submarine) => {
        const W = this.environment.calcWeightForce(this)
        const F_buoyancy = this.environment.calcArchimedesForce(this)
        const F_engine = this.environment.calcEngineForce(this)
        const F_resistance_on_body = this.environment.calcResistanceOnBody(this)
        
        const F_resistance_back_h  = this.environment.calcResistanceForceOnHorizontalPlanes(this , this.areaOfBackPlane , this.angleHorizontalBackPlane, this.velocity)
        const F_resistance_front_h = this.environment.calcResistanceForceOnHorizontalPlanes(this , this.areaOfFrontPlane , this.angleHorizontalFrontPlane, this.velocity)
        const F_resistance_v = this.environment.calcResistanceForceOnVerticalPlanes(this , this.areaOfBackPlane , this.angleVerticalPlane, this.velocity)
        
        const F_resistance = new THREE.Vector3().add(F_resistance_v).add(F_resistance_front_h).add(F_resistance_back_h)
        
        info['Engine_Force'].textContent = 'Engine_Force : '   +  -F_engine.z.toFixed(0)
        info['Speed_Of_Fans'].textContent = 'Speed_Of_Fans : ' +  this.speedOfFan.toFixed(0)
        info['buoyancy'].textContent = 'Buoyancy : ' +  F_buoyancy.y.toFixed(0)
        info['weight'].textContent = 'Salah : ' +  W.y.toFixed(0)
        const m = (this.netMass + this.volumeOfWaterInTanks)

        const matrix = new THREE.Matrix4()
        matrix.makeRotationFromQuaternion(submarine.group.quaternion)

        
        let localEngineForce = F_engine.clone().applyMatrix4(matrix)
        let localBuoyancy = F_buoyancy.clone().applyMatrix4(matrix)
        console.log("Engine Force Rotation:" , {
            "Before":F_engine,
            "After":localEngineForce
        })
        const Total_force = new THREE.Vector3()
            .add(localEngineForce)
            .add(localBuoyancy)
            .sub(W)
            .sub(F_resistance)
            .sub(F_resistance_on_body)
        this.total_force.copy(Total_force)
        this.acceleration.copy(Total_force.divideScalar(m))

        console.log("Acceleration" , {
            "net mass": this.netMass,
            'volume of water in tanks': this.volumeOfWaterInTanks,
            "F_engine": F_engine,
            "F_resistance_on_body":F_resistance_on_body,
            "F_resistance_back_h":F_resistance_back_h,
            "F_resistance_front_h":F_resistance_front_h,
            "F_resistance_v":F_resistance_v,
            "F_resistance":F_resistance,
            'Weight Force': W , 
            'F_buoyancy': F_buoyancy,
            'XX':(F_buoyancy - W - F_resistance_on_body.y - F_resistance.y)
        })
        info['Acceleration_x'].textContent = 'Acceleration_on_x : ' +  this.acceleration.x.toFixed(0)
        info['Acceleration_y'].textContent = 'Acceleration_on_x : ' +  this.acceleration.y.toFixed(0)
        info['Acceleration_z'].textContent = 'Acceleration_on_x : ' +  this.acceleration.z.toFixed(0)
    }

    calcNextVelocity = (deltaTime , info) => {
        console.log("Next Velocity" , {
            "Delta Time": deltaTime
        })

        const vx = this.velocity.x + this.acceleration.x * deltaTime
        const vy = this.velocity.y + this.acceleration.y * deltaTime
        const vz = this.velocity.z + this.acceleration.z * deltaTime

        info['Speed_on_x'].textContent = 'speed_on_x : ' +  vx.toFixed(0)
        info['Speed_on_y'].textContent = 'speed_on_y : ' +  vy.toFixed(0)
        info['Speed_on_z'].textContent = 'speed_on_z : ' +  vz.toFixed(0)


        this.velocity.set(vx , vy , vz)
    }

    calcNextLocation = (deltaTime , info) => {
        let x = this.position.x + this.velocity.x * deltaTime
        let y = this.position.y + this.velocity.y * deltaTime
        let z = this.position.z + this.velocity.z * deltaTime
        y = Math.min(0 , y)
        info['Position_x'].textContent = 'Position_x : ' + x.toFixed(0)
        info['Position_y'].textContent = 'Position_y : ' + y.toFixed(0)
        info['Position_z'].textContent = 'Position_z : ' + z.toFixed(0)

        this.position.set(x , y , z)
    }

    LinearMotionInMoment = (deltaTime , info , submarine) => {
        this.calcLinearAcceleration(info , submarine)
        this.calcNextVelocity(deltaTime , info)
        this.calcNextLocation(deltaTime , info)
    }
    /*  */
    
    calcAngularAccelerate = (info) => {
        const InertiaForce            = this.environment.calcMomentOfInertiaOfCylinder(this)
        const ResistanceForce_back_H  = this.environment.calcResistanceForceOnHorizontalPlanes(this , this.areaOfBackPlane , this.angleHorizontalBackPlane, this.angularVelocity)
        const ResistanceForce_front_H = this.environment.calcResistanceForceOnHorizontalPlanes(this , this.areaOfFrontPlane , this.angleHorizontalFrontPlane, this.angularVelocity)
        const ResistanceForce_V       = this.environment.calcResistanceForceOnVerticalPlanes(this , this.areaOfBackPlane , this.angleVerticalPlane, this.angularVelocity)

        const moment_h_back  = ResistanceForce_back_H.length() * this.distanceHorizontalBackPlanesFromTheCenter * Math.cos(this.angleHorizontalBackPlane)
        const moment_h_front = ResistanceForce_front_H.length() * this.distanceHorizontalFrontPlanesFromTheCenter * Math.cos(this.angleHorizontalFrontPlane)
        const moment_v       = ResistanceForce_V.length() * this.distanceVerticalPlanesFromTheCenter * Math.cos(this.angleVerticalPlane)


        console.log("Angular Acceleration" , {
            "ResistanceForce_back_H" : ResistanceForce_back_H,
            "ResistanceForce_front_H" : ResistanceForce_front_H,
            "ResistanceForce_V" : ResistanceForce_V,
            "Moment_y" : moment_v,
            "Moment_z" : moment_h_back,
            "Moment_x" : moment_h_front 
        })

        const res = new THREE.Vector3(0, moment_v / InertiaForce[1][1] , (moment_h_back + moment_h_front) / InertiaForce[2][2])

        this.angularAcceleration.set(res.x , res.y , res.z)
    }  

    calcAngularVelocity = (deltaTime) => {
        const wx = this.angularVelocity.x + this.angularAcceleration.x * deltaTime
        const wy = this.angularVelocity.y + this.angularAcceleration.y * deltaTime
        const wz = this.angularVelocity.z + this.angularAcceleration.z * deltaTime

        this.angularVelocity = new THREE.Vector3(wx , wy , wz)
        return this.angularVelocity
    }

    calcNextAngel = (deltaTime , info , submarine , camera) => {
        let x = this.rotation.x + this.angularVelocity.x * deltaTime; 
        let y = this.rotation.y + this.angularVelocity.y * deltaTime; 
        let z = this.rotation.z + this.angularVelocity.z * deltaTime; 

        // stop rotation on Z
        const Z = 0.34
        if (z < 0.34 && z > -0.34){
            submarine.group.rotateX(deltaTime * this.angularVelocity.z)
            // camera.rotateX(deltaTime * this.angularVelocity.z)
        }
        z = Math.min(z, Z)
        z = Math.max(z, -Z)

        this.rotation.set(x , y , z)
        let matrix = new THREE.Matrix4()

        matrix.makeRotationZ(this.rotation.z)
        this.total_force.applyMatrix4(matrix)
        

        submarine.group.rotateY(deltaTime * this.angularVelocity.y)
        info['Rotation_x'].textContent = 'Rotation_x : ' + x.toFixed(0)
        info['Rotation_y'].textContent = 'Rotation_y : ' + y.toFixed(0)
        info['Rotation_z'].textContent = 'Rotation_z : ' + z.toFixed(0)
    }

    AngularMotionInMoment = (deltaTime , info , submarine , camera) => {
        this.calcAngularAccelerate(info)
        this.calcAngularVelocity(deltaTime , info)
        this.calcNextAngel(deltaTime , info , submarine , camera)
    }

    getRotatedForce = (force , sign = 1) => {
    //    return this.getRotatedForce_Z(this.getRotatedForce_Y(force , sign) , sign)
        let Rotation_x = new THREE.Matrix4().makeRotationX(this.rotation.x * sign)
        let Rotation_y = new THREE.Matrix4().makeRotationY(this.rotation.y * sign)
        let Rotation_z = new THREE.Matrix4().makeRotationZ(this.rotation.z * sign)

        let combineRotation = new THREE.Matrix4()

        combineRotation.multiply(Rotation_z).multiply(Rotation_y).multiply(Rotation_x)
        let x = force 
        force = force.applyMatrix4(combineRotation)
        console.log("Rotations :" , {
            "Before" : x,
            "After": force
        })
        return force
    }
    
}