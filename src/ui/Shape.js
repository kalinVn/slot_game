import {Graphics} from 'pixi.js';


class Shape {

        drawRect (params) { 
                let graphic = new Graphics();

                graphic.beginFill(params.color, 1);
                graphic.drawRect(params.x, params.y, params.width , params.height);
                graphic.endFill();

                return graphic;
        }

}

export default Shape;