import * as PIXI from 'pixi.js';
import globals from '../globals';
import Collision from '../lib/Collision';
import Hay from './Hay';

const MOVE_SPEED = 0.55;
const BULLET_SCALE = 0.75;
const TORADIAN = Math.PI/180;

export default class Bullet{
    container: PIXI.Container;

    constructor(private texture:string, private startX: number, private startY: number, private direction: number, private damage: number){
        this.container = new PIXI.Container();
        this.container.position.set(
            this.startX + 15, 
            this.startY + 17.5
        );
        globals.stage?.addChild(this.container);

        this.render();
    }

    private render(){
        // bullet graphic
        const bullet = new PIXI.Sprite(PIXI.Assets.get(this.texture));
        bullet.scale.set(BULLET_SCALE);
        bullet.anchor.set(0.5);
        bullet.position.set(0, 0);
        bullet.rotation = this.direction - (180*TORADIAN);
        this.container?.addChild(bullet);
    }

    move(delta:number){
        // move the bullet based on angle
        const addX = Math.cos(this.direction + (90*TORADIAN)) * delta * MOVE_SPEED;
        const addY = Math.sin(this.direction + (90*TORADIAN)) * delta * MOVE_SPEED;
        this.container.x += addX;
        this.container.y += addY;

        // check collisions
        let collisionDetected = false;
        Collision.detectCollision(this.container, globals.map.haysArray, (hay: Hay) => {
            this.remove();
            hay.setHealth(hay.getHealth()-this.damage);
            collisionDetected = true;
        });
        if(collisionDetected)return;
        Collision.detectCollision(this.container, globals.map.wallsArray, () => {
            this.remove();
            collisionDetected = true;
        });
        if(collisionDetected)return;
        
        // if outside the map bounds remove the bullet
        if(this.container.x < 0 || this.container.x > globals.map.size*35 || this.container.y < 0 || this.container.y > globals.map.size*35){
            this.remove();
        }
    }

    remove(){
        globals.bullets = globals.bullets.filter(bullet => bullet !== this);
        globals.stage?.removeChild(this.container);
    }
}