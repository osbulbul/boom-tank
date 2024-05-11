export default class Collision{
    static detectCollision(object: any, objects: any[], action: Function){
        for(const obj of objects){
            if (Collision.rrCollision(object, obj)) {
                action?.(obj);
                break;
            }
        }
    }

    //rect to rect collision
    static rrCollision(obj1: any, obj2: any){
        if (obj1.x < obj2.x + obj2.width-5 &&
            obj1.x + obj1.width-5 > obj2.x &&
            obj1.y < obj2.y + obj2.height-5 &&
            obj1.y + obj2.height-5 > obj2.y) {
                return true;
        }
        return false;
    }


}