import * as PIXI from 'pixi.js';
import Tank from './components/Tank';

interface GlobalsInterface{
    app?: PIXI.Application;
    stage?: PIXI.Container;
    selectedTank?: Tank;
    map?: any;
    tanks: Tank[];
    bullets: any[];
}

const globals:GlobalsInterface = {
    tanks: [],
    bullets: []
};
export default globals;