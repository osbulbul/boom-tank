import * as PIXI from 'pixi.js';

type SheetType = {
    graph: PIXI.Graphics, 
    active: boolean,
    colorPair:{front:number, back:number}, 
    randomModifier: number, 
    rotation: number, 
    velocity: {x:number, y:number},
    flipSpeed:number,
    terminalVelocity:number,
    update: Function
};

export default class Confetti{
    static pop(app: any, scene:any, x:number, y:number){
        let rand = (min:number, max:number) => Math.random() * (max - min) + min;
        let params = {
            // min and max size for each rectangle
            size: { x: [10, 15], y: [15, 20] },
            // power of explosion
            initSpeed: 14,
            // defines how fast particles go down after blast-off
            gravity: 0.5,
            // how wide is explosion
            drag: 0.5,
            // how slow particles are falling
            terminalVelocity: 5,
            // how fast particles are rotating around themselves
            flipSpeed: 0.017,
        };
        let colors: object[] = [
            { front: 0x9dff7f, back: 0x7be25f },
            { front: 0xffa049, back: 0xeb6b00 },
            { front: 0xff6d69, back: 0xb93d32 },
            { front: 0xff5e9d, back: 0xc43168 },
            { front: 0xb48def, back: 0x8a5ed5 },
            { front: 0x4a90e2, back: 0x256ab3 },
            { front: 0x5ce5e5, back: 0x28bdbd },
        ];

        let container = new PIXI.Container();
        scene.addChild(container);
        container.position.set(x, y);

        for (let i = 0; i < 20; i++) {
            let sheet:SheetType = {
                graph: new PIXI.Graphics(),
                active: true,
                colorPair: colors[Math.floor(Math.random() * colors.length)] as {front:number, back:number},
                randomModifier: rand(-1, 1),
                rotation: rand(0, 2 * Math.PI),
                velocity: {
                    x: rand(-params.initSpeed, params.initSpeed) * 0.4,
                    y: rand(-params.initSpeed, params.initSpeed),
                },
                flipSpeed: rand(0.2, 1.5) * params.flipSpeed,
                terminalVelocity: rand(1, 1.5) * params.terminalVelocity,
                update: () => {
                    if(!sheet.active)return;

                    let delta = app.ticker.deltaMS;
                    sheet.velocity.x *= 0.98;
                    sheet.graph.x += sheet.velocity.x * delta * (rand(0.02, 0.15));
                    
                    sheet.velocity.y += sheet.randomModifier * params.drag;
                    sheet.velocity.y += params.gravity;
                    sheet.velocity.y = Math.min(sheet.velocity.y, params.terminalVelocity);
                    sheet.graph.y += sheet.velocity.y * delta * (rand(0.02, 0.15));

                    sheet.graph.scale.y = Math.cos((sheet.graph.y + sheet.randomModifier) * sheet.flipSpeed);
                    sheet.graph.tint = sheet.graph.scale.y > 0 ? sheet.colorPair.front : sheet.colorPair.back;

                    // slowly reduce alpha
                    sheet.graph.alpha -= 0.005;

                    setTimeout(() => {
                        sheet.active = false;
                        sheet.graph.destroy();
                    }, 2000);
                }
            };
            sheet.graph.rect(0, 0, rand(params.size.x[0], params.size.x[1]), rand(params.size.y[0], params.size.y[1]));
            sheet.graph.fill(0xffffff);
            sheet.graph.tint = sheet.colorPair.front;
            container.addChild(sheet.graph);

            app.ticker.add(sheet.update);
            
        }
    }
}