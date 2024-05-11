import Manager from './lib/Manager';

// Game options
const options = {
    width: 1750,
    height: 1750,
    mapSize: 50,
    hays: 25,
    hayHealth: 100,
    walls: 50,
};

new Manager(options);