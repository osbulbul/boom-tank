import * as PIXI from 'pixi.js';
import globals from '../globals';
import Map from '../lib/Map';
import Tank from '../components/Tank';

import tile from '../assets/tile.png';
import tile2 from '../assets/tile2.png';
import wall from '../assets/wall.png';
import hay from '../assets/hay.png';
import tank_red from '../assets/tank_red.png';
import bullet_red from '../assets/bullet_red.png';
import tank_blue from '../assets/tank_blue.png';
import bullet_blue from '../assets/bullet_blue.png';
import tank_green from '../assets/tank_green.png';
import bullet_green from '../assets/bullet_green.png';

type optionsObj = {
    width: number;
    height: number;
    mapSize: number;
    hays: number;
    hayHealth: number;
    walls: number;
};

export default class Manager{
    private options: optionsObj;
    private isUpPressed:boolean = false;
    private isLeftPressed:boolean = false;
    private isRightPressed:boolean = false;
    private isDownPressed:boolean = false;

    constructor(options: optionsObj){
        this.options = options;

        this.initialize();
    }

    async initialize(){
        // Initialize the game
        const app = new PIXI.Application();
        await app.init({
            width: this.options.width,
            height: this.options.height,
            backgroundColor: 0x000000,
        });
        document.body.appendChild(app.canvas);
        globals.app = app;
        globals.stage = app.stage;

        // switch to preload
        this.preload();
    }

    preload(){
        // Add assets
        PIXI.Assets.add({alias: 'tile', src: tile});
        PIXI.Assets.add({alias: 'tile2', src: tile2});
        PIXI.Assets.add({alias: 'wall', src: wall});
        PIXI.Assets.add({alias: 'hay', src: hay});
        PIXI.Assets.add({alias: 'tank_red', src: tank_red});
        PIXI.Assets.add({alias: 'bullet_red', src: bullet_red});
        PIXI.Assets.add({alias: 'tank_blue', src: tank_blue});
        PIXI.Assets.add({alias: 'bullet_blue', src: bullet_blue});
        PIXI.Assets.add({alias: 'tank_green', src: tank_green});
        PIXI.Assets.add({alias: 'bullet_green', src: bullet_green});
        const assetsPromise = PIXI.Assets.load(['tile', 'tile2', 'wall', 'hay', 'tank_red', 'tank_blue', 'tank_green', 'bullet_red', 'bullet_blue', 'bullet_green']);

        assetsPromise.then(() => {
            // assets loaded switch to game
            this.startGame();
            globals.app?.ticker.add(this.update.bind(this));
        });
    }

    startGame(){
        // Create tanks
        const redTank = new Tank('tank_red', 'bullet_red', {col: 22, row: 22}, 2, 10);
        const blueTank = new Tank('tank_blue', 'bullet_blue', {col: 24, row: 22}, 3, 20);
        const greenTank = new Tank('tank_green', 'bullet_green', {col: 26, row: 22}, 1, 25);
        globals.tanks = [redTank, blueTank, greenTank];

        // Create the map
        globals.map = new Map(this.options.mapSize, this.options.hays, this.options.hayHealth, this.options.walls, globals.tanks);

        redTank.addToStage();
        blueTank.addToStage();
        greenTank.addToStage();
        globals.selectedTank = redTank;
        redTank.select();

        window.addEventListener('keydown', this.keyDown.bind(this));
        window.addEventListener('keyup', this.keyUp.bind(this));
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
    }

    update(){
        if(!globals.app)return;
        let delta = globals.app.ticker.deltaMS;
    
        // Check actions for the selected tank
        if(globals.selectedTank){
            if(this.isUpPressed)globals.selectedTank.move(delta);
            if(this.isLeftPressed)globals.selectedTank.turnLeft(delta);
            if(this.isRightPressed)globals.selectedTank.turnRight(delta);
            if(this.isDownPressed)globals.selectedTank.move(delta, true);
        }

        // Check bullets
        for(let i = 0; i < globals.bullets.length; i++){
            globals.bullets[i].move(delta);
        }
    }

    keyDown(e:KeyboardEvent){
        switch(e.key){
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.isUpPressed = true;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.isLeftPressed = true;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.isRightPressed = true;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.isDownPressed = true;
                break;
            case 't':
            case 'T':
                this.nextTank();
                break;
            case ' ':
                globals.selectedTank?.shoot();
                break;
        }
    }

    keyUp(e:KeyboardEvent){
        switch(e.key){
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.isUpPressed = false;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.isLeftPressed = false;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.isRightPressed = false;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.isDownPressed = false;
                break;
        }
    }

    nextTank(){
        if(!globals.tanks || !globals.selectedTank) return;

        const index = globals.tanks.indexOf(globals.selectedTank);
        globals.selectedTank = globals.tanks[(index+1)%globals.tanks.length];
        globals.tanks.forEach(tank => {
            tank.unselect();
        });
        globals.selectedTank.select();
    }

    resize(){
        if(!globals.app)return;

        // find the new scale
        const scale = Math.min(window.innerWidth / this.options.width, (window.innerHeight) / this.options.height);

        // find the new size
        const newWidth = Math.floor(scale * this.options.width);
        const newHeight = Math.floor(scale * this.options.height);

        // find the new margins
        const horizontalMargin = (window.innerWidth - newWidth) / 2;
        const verticalMargin = (window.innerHeight - newHeight) / 2;

        // css to center the canvas
        globals.app.canvas.style.width = `${newWidth}px`;
        globals.app.canvas.style.height = `${newHeight}px`;
        globals.app.canvas.style.marginLeft = globals.app.canvas.style.marginRight = `${horizontalMargin}px`;
        globals.app.canvas.style.marginTop = globals.app.canvas.style.marginBottom = `${verticalMargin}px`;
    }
}