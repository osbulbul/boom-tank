import * as PIXI from 'pixi.js';
import globals from '../globals';
import Confetti from './Confetti';

const FONT_STYLE = {
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'bold' as PIXI.TextStyleFontWeight,
    align: 'center' as PIXI.TextStyleAlign,
    fill: '#ffffff',
    stroke: { color: '#4a1850', width: 5, join: 'round' },
    dropShadow: {
        color: '#000000',
        blur: 4,
        angle: Math.PI / 6,
        distance: 0,
    },
};

export default class Hay{
    sprite: PIXI.Sprite;
    container: PIXI.Container;
    healthText: PIXI.Text;
    x: number;
    y: number;
    width: number = 35;
    height: number = 35;

    constructor(private health: number, private texture: string, private position: {x: number, y: number}){
        this.x = position.x;
        this.y = position.y;

        this.container = new PIXI.Container();
        this.container.position.set(this.position.x, this.position.y);
        globals.stage?.addChild(this.container);

        this.sprite = new PIXI.Sprite(PIXI.Assets.get(this.texture));
        this.sprite.scale.set(35/this.sprite.width);
        this.container?.addChild(this.sprite);

        this.healthText = new PIXI.Text({text:this.health.toString(), style: new PIXI.TextStyle(FONT_STYLE)});
        this.healthText.anchor.set(0.5);
        this.healthText.position.set(17, 17);
        this.container?.addChild(this.healthText);
    }

    getHealth(){
        return this.health;
    }

    setHealth(newHealth: number){
        this.health = newHealth;
        if(this.health <= 0){
            Confetti.pop(globals.app, globals.stage, this.x, this.y);
            this.remove();
        } else {
            this.healthText.text = newHealth.toString();
        }
    }

    remove(){
        globals.map.haysArray = globals.map.haysArray.filter((hay: this) => hay !== this);
        globals.stage?.removeChild(this.container);
    }
}