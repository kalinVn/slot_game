import Shape from "./Shape.js";
import {Container} from 'pixi.js';
import Button from './Button.js';

class ControlPanel {
	constructor () {
		this._shape;
        this._button;
        this._container;
	}

	async create () {
        this._shape = new Shape();
        this._button = new Button();
        const btnParams = {
            label: 'Play',
            y: 555,
		    x: 240,
		    width: 140,
		    height: 40
        };
        this._button.create(btnParams);
        this._container = new Container();
        const params = {
			regX : 0,
			regY : 0,
			width : 600,
			height : 70,
			x : 0,
			y : 550,
			radius : 0,
			color : '0x523900FF'
		};

        const shape = await this._shape.drawRect(params);
        shape.alpha = 0.2;
        this._container.addChild(shape);
        
        const btnContainer = this._button.getContainer();
        this._container.addChild(btnContainer);
	}
    
    getContainer () {
        return this._container;
    }

    getButton () {
        return this._button;
    }

}

export default ControlPanel;