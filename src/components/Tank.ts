import * as PIXI from 'pixi.js';
import globals from '../globals';
import Collision from '../lib/Collision';
import Bullet from './Bullet';

const TORADIAN = Math.PI/180;
const FORWARD_SPEED = 0.26;
const BACKWARD_SPEED = 0.13;
const TURN_SPEED = 0.26;

export default class Tank{
    container: PIXI.Container;
    sprite: PIXI.Sprite;
    selectGraphic: PIXI.Graphics;
    canShoot: boolean = true;
    x: number;
    y: number;

    constructor(private texture: string, private bulletTexture:string, private position: {col: number, row: number}, private bulletLimit: number, private damage: number){
        this.container = new PIXI.Container();
        this.container.position.set(this.position.col * 35, this.position.row * 35);
        this.x = this.container.x;
        this.y = this.container.y;

        this.sprite = new PIXI.Sprite(PIXI.Assets.get(this.texture));
        this.sprite.scale.set(35/this.sprite.width);
        this.sprite.anchor.set(0.5);
        this.sprite.position.set(this.sprite.width/2, this.sprite.height/2);
        this.sprite.angle = 180;
        this.container?.addChild(this.sprite);

        this.selectGraphic = new PIXI.Graphics();
        let size = this.sprite.width+8;
        this.selectGraphic.roundRect(-size/2, -size/2, size, size, 4);
        this.selectGraphic.stroke({width: 2, color: 0xff0000, alpha: 0.5});
        this.selectGraphic.position.set(this.sprite.width/2, this.sprite.height/2);
        this.container?.addChild(this.selectGraphic);
        this.selectGraphic.visible = false;
    }

    addToStage(){
        globals.stage?.addChild(this.container);
    }

    move(delta:number, backward: boolean = false){
        // fake move the forward based on angle
        if(!this.sprite)return;
        const addX = Math.cos(this.sprite.rotation + (90*TORADIAN)) * (backward ? delta*BACKWARD_SPEED : delta*FORWARD_SPEED);
        const addY = Math.sin(this.sprite.rotation + (90*TORADIAN)) * (backward ? delta*BACKWARD_SPEED : delta*FORWARD_SPEED);
        const new_x = this.container.x + (backward ? -(addX-5) : (addX+5));
        const new_y = this.container.y + (backward ? -(addY-5) : (addY+5));

        // check collisions
        let collisionDetected = false;
        Collision.detectCollision({x: new_x, y: new_y, width: this.container.width-10, height: this.container.height-10}, globals.map.wallsArray, () => {
            collisionDetected = true;
        });
        if(collisionDetected)return;

        Collision.detectCollision({x: new_x, y: new_y, width: this.container.width-10, height: this.container.height-10}, globals.map.haysArray, () => {
            collisionDetected = true;
        });
        if(collisionDetected)return;

        for(let i = 0; i < globals.tanks.length; i++){
            if(globals.tanks[i] === this)continue;
            if(Collision.rrCollision({x: new_x, y: new_y, width: this.container.width-10, height: this.container.height-10}, globals.tanks[i].container)){
                return;
            }
        }

        // check screen bounds
        if(new_x < 0 || new_x > globals.map.size * 34.5 || new_y < 0 || new_y > globals.map.size * 34.5){
            return;
        }

        // if everything is clear move the tank
        this.container.x = this.container.x + (backward ? -(addX) : (addX));;
        this.container.y = this.container.y + (backward ? -(addY) : (addY));;
    }

    turnLeft(delta:number){
        this.sprite.angle -= delta * TURN_SPEED;
        this.selectGraphic.rotation = this.sprite.rotation;
    }

    turnRight(delta:number){
        this.sprite.angle += delta * TURN_SPEED;
        this.selectGraphic.rotation = this.sprite.rotation;
    }

    select(){
        this.selectGraphic.visible = true;
    }

    unselect(){
        this.selectGraphic.visible = false;
    }

    shoot(){
        if(!this.canShoot)return;

        this.canShoot = false;
        for(let i = 0; i < this.bulletLimit; i++){
            setTimeout(() => {
                globals.bullets.push(new Bullet(this.bulletTexture, this.container.x, this.container.y, this.sprite?.rotation!, this.damage));
            }, i * 100);
        }

        setTimeout(() => {
            this.canShoot = true;
        }, 1000);
    }
}