import Shape from "./Shape.js";
import {Container, Text} from 'pixi.js';

class Button {
	constructor () {
		this._shape = new Shape();
        this._container;
	}

	async create (params) {
		const label = params.label
		const x = params.x;
		const y = params.y;
		const width = params.width;
		const height = params.height
		this._container = new Container();
		this._shape = new Shape();
		const paramsShape = {
			regX : 0,
			regY : 0,
			width : width,
			height : height,
			x : 0,
			y : 0,
			radius : 0,
			color : '0xf51d1d'
		}

        this._shape = await this._shape.drawRect(paramsShape);
		this._container.addChild(this._shape);
		this._container.buttonMode = true;
		this._container.cursor = 'pointer';
		this._container.interactive = true;
		this._container.y = y;
		this._container.x = x;
        const text = new Text(label, {
            fontFamily : 'Arial', 
            fontSize: 27, 
            fill : 0xffffff
        });

		text.anchor.set(0.5, 0.5);
		text.x = this._container.width / 2;
		text.y = this._container.height / 2;
        this._container.addChild(text);

	}
	
	setPosition (x, y) {
		this._container.x = x;
		this._container.y = y;
	}

    getContainer() {
        return this._container;
    }
}

export default Button;