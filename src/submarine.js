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
        enginePower                                 = 10000,
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

    calcLinearAcceleration = (info) => {
        const W = this.environment.calcWeightForce(this).length()
        const F_buoyancy = this.environment.calcArchimedesForce(this).length()
        const F_engine = this.environment.calcEngineForce(this)
        const F_resistance_on_body = this.environment.calcResistanceOnBody(this)
        
        const F_resistance_back_h  = this.environment.calcResistanceForceOnHorizontalPlanes(this , this.areaOfBackPlane , this.angleHorizontalBackPlane)
        const F_resistance_front_h = this.environment.calcResistanceForceOnHorizontalPlanes(this , this.areaOfFrontPlane , this.angleHorizontalFrontPlane)
        const F_resistance_v = this.environment.calcResistanceForceOnVerticalPlanes(this , this.areaOfBackPlane , this.angleVerticalPlane)
        
        const F_resistance = new THREE.Vector3().add(F_resistance_v).add(F_resistance_front_h).add(F_resistance_back_h)
        
        info['Engine_Force'].textContent = 'Engine_Force : '   +  F_engine.x.toFixed(0)
        info['Speed_Of_Fans'].textContent = 'Speed_Of_Fans : ' +  this.speedOfFan.toFixed(0)
        
        const m = (this.netMass + this.volumeOfWaterInTanks)

        const ax = (F_engine.x - F_resistance_on_body.x - F_resistance.x) / m
        const ay = (F_buoyancy - W - F_resistance_on_body.y - F_resistance.y) / m
        const az = (-F_resistance_on_body.z - F_resistance.z) / m


        info['Acceleration_x'].textContent = 'Acceleration_on_x : ' +  ax.toFixed(0)
        info['Acceleration_y'].textContent = 'Acceleration_on_x : ' +  ay.toFixed(0)
        info['Acceleration_z'].textContent = 'Acceleration_on_x : ' +  az.toFixed(0)
        // const res = this.getRotatedForce(new THREE.Vector3(ax , ay , az) , 1)
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
            'acceleration': new THREE.Vector3(ax , ay , az),
            'XX':(F_buoyancy - W - F_resistance_on_body.y - F_resistance.y)
            // 'rotated_acceleration': res
        })
        this.acceleration.set(ax , ay , az)
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
        
        // return this.velocity
    }

    calcNextLocation = (deltaTime , info) => {
        const x = this.position.x + this.velocity.x * deltaTime
        const y = this.position.y + this.velocity.y * deltaTime
        const z = this.position.z + this.velocity.z * deltaTime

        info['Position_x'].textContent = 'Position_x : ' + x.toFixed(0)
        info['Position_y'].textContent = 'Position_y : ' + y.toFixed(0)
        info['Position_z'].textContent = 'Position_z : ' + z.toFixed(0)

        this.position.set(x , y , z)
    }

    LinearMotionInMoment = (deltaTime , info) => {
        this.calcLinearAcceleration(info)
        this.calcNextVelocity(deltaTime , info)
        this.calcNextLocation(deltaTime , info)
    }
    /*  */
    
    calcAngularAccelerate = () => {
        const InertiaForce            = this.environment.calcMomentOfInertiaOfCylinder(this)
        const ResistanceForce_back_H  = this.environment.calcResistanceForceOnHorizontalPlanes(this , this.areaOfBackPlane , this.angleHorizontalBackPlane).length()
        const ResistanceForce_front_H = this.environment.calcResistanceForceOnHorizontalPlanes(this , this.areaOfFrontPlane , this.angleHorizontalFrontPlane).length()
        const ResistanceForce_V       = this.environment.calcResistanceForceOnVerticalPlanes(this , this.areaOfBackPlane , this.angleVerticalPlane).length()

        const back_h  = ResistanceForce_back_H  * this.distanceHorizontalBackPlanesFromTheCenter
        const front_h = ResistanceForce_front_H * this.distanceHorizontalFrontPlanesFromTheCenter
        
        const moment_h = (back_h + front_h)
        const moment_v = ResistanceForce_V * this.distanceVerticalPlanesFromTheCenter


        console.log("Angular Acceleration" , {
            "ResistanceForce_back_H" : ResistanceForce_back_H,
            "ResistanceForce_front_H" : ResistanceForce_front_H,
            "ResistanceForce_V" : ResistanceForce_V,
            "Moment_y" : moment_v,
            "Moment_z" : moment_h, 
        })

        const res = new THREE.Vector3(0 , moment_h / InertiaForce[1][1] , moment_v / InertiaForce[2][2])
        // res = this.getRotatedForce(res , -1)

        this.angularAcceleration.set(res.x , res.y , res.z)
        // return Moment_z / InertiaForce[2][2]
    }  

    calcAngularVelocity = (deltaTime , info) => {
        const wx = this.angularVelocity.x + this.angularAcceleration.x * deltaTime
        const wy = this.angularVelocity.y + this.angularAcceleration.y * deltaTime
        let wz = this.angularVelocity.z + this.angularAcceleration.z * deltaTime

        // if (wz > 1)
        //     wz = 1;

        info['Angular_X'].textContent = 'Angular_X: ' +  wx.toFixed(0)
        info['Angular_Y'].textContent = 'Angular_Y: ' +  wy.toFixed(0)
        info['Angular_Z'].textContent = 'Angular_Z: ' +  wz.toFixed(0)

        

        this.angularVelocity = new THREE.Vector3(wx , wy , wz)
        return this.angularVelocity
    }

    calcNextAngel = (deltaTime , info , submarine ) => {
        const x = this.rotation.x + this.angularVelocity.x * deltaTime; 
        let y = this.rotation.y + this.angularVelocity.y * deltaTime; 
        let z = this.rotation.z + this.angularVelocity.z * deltaTime; 

        const Z = 0.34
        if (z < 0.34 && z > -0.34)
            submarine.group.rotateX(deltaTime * this.angularVelocity.z)
        z = Math.min(z, Z)
        z = Math.max(z, -Z)


        this.rotation.set(x , y , z)

        // submarine.group.rotateX(deltaTime * this.angularVelocity.z)
        submarine.group.rotateY(deltaTime * this.angularVelocity.y)
            
        info['Rotation_x'].textContent = 'Rotation_x : ' + x.toFixed(0)
        info['Rotation_y'].textContent = 'Rotation_y : ' + y.toFixed(0)
        info['Rotation_z'].textContent = 'Rotation_z : ' + z.toFixed(0)
    }

    AngularMotionInMoment = (deltaTime , info , submarine) => {
        this.calcAngularAccelerate(info )
        this.calcAngularVelocity(deltaTime , info)
        this.calcNextAngel(deltaTime , info , submarine)
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