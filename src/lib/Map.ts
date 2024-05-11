import * as PIXI from 'pixi.js';
import globals from '../globals';
import Hay from '../components/Hay';
import Tank from '../components/Tank';

const BLOCK_SIZE = 35;

export default class Map {
    haysArray: Hay[] = [];
    wallsArray: PIXI.Sprite[] = [];
    tanks: Tank[] = [];

    constructor(private size: number, private haysLimit: number, private hayHealth: number, private wallsLimit: number, tanks: Tank[]) {
        this.tanks = tanks;

        this.generateBackground();
        this.generateHays();
        this.generateWalls();
    }

    private generateBackground() {
        const tiles = ['tile', 'tile2'];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const tileTexture = tiles[Math.floor(Math.random() * 2)];
                const tile = new PIXI.Sprite(PIXI.Assets.get(tileTexture));
                tile.scale.set(BLOCK_SIZE/tile.width);
                tile.x = i * BLOCK_SIZE;
                tile.y = j * BLOCK_SIZE;
                globals.stage?.addChild(tile);
            }
        }
    }

    private generateHays() {
        for (let i = 0; i < this.haysLimit; i++) {
            const pos = this.findEmptySpot([...this.haysArray, ...this.wallsArray, ...this.tanks]);
            const hay = new Hay(this.hayHealth, 'hay', pos);
            this.haysArray.push(hay);
        }
    }

    private generateWalls() {
        for (let i = 0; i < this.wallsLimit; i++) {
            const pos = this.findEmptySpot([...this.wallsArray, ...this.haysArray, ...this.tanks]);
            const wall = new PIXI.Sprite(PIXI.Assets.get('wall'));
            wall.scale.set(BLOCK_SIZE/wall.width);
            wall.position.set(pos.x, pos.y);
            globals.stage?.addChild(wall);
            this.wallsArray.push(wall);
        }
    }

    findEmptySpot(array: any[]): {x: number, y: number}{
        // Find random spot
        let x = Math.floor(Math.random() * this.size);
        let y = Math.floor(Math.random() * this.size);
        let limit = array.length;
        let counter = 0;

        // Check if the spot is empty
        while(array.find(item => item.x === x * BLOCK_SIZE && item.y === y * BLOCK_SIZE) && counter < limit*2){
            x = Math.floor(Math.random() * this.size);
            y = Math.floor(Math.random() * this.size);
            counter++;
        }

        return {x: x * BLOCK_SIZE, y: y * BLOCK_SIZE};
    }
}