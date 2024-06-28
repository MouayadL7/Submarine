import { Vector } from "./Vector";

export class Goasa{
    constructor(position = new Vector(0, 0, 0)) {
        this.position = position;
    }
    move() {
        this.position.z-=0.5;
    }
}