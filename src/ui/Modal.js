import Shape from "./Shape.js";
import Button from "./Button.js";

import {Container, Text} from 'pixi.js';

import {
        MODAL_BTN_WIDTH, MODAL_WIDTH, MODAL_HEIGHT, MODAL_COLOR, MODAL_ALPHA, MODAL_TITLE_INITIAL_Y,MODAL_ROW_SYMBOL_MARGIN_X,
        MODAL_TITLE_FONT_SIZE, MODAL_TITLE_FONT_COLOR, MODAL_TITLE_FONT_FAMILY, MODAL_ROW_MARGIN_Y, MODAL_PLAY_BTN_INITIANAL_Y,
        MODAL_SPRITE_WIDTH, MODAL_SPRITE_HEIGHT, MODAL_SPRITE_INITIAL_Y, MODAL_PLAY_BTN_MARGIN_Y, MODAL_PLAY_BTN_HEIGHT, REELS_COUNT
    } from '../config.js';


class Modal {

	constructor(){
		this._shape;
        this._button;
        this._container;
	}

	create (params) { 
        const lines = params.lines;
        
        this._shape = new Shape();
        this._button = new Button();
        let paramsShape = {
            regX: 0,
            regY: 0,
            width: MODAL_WIDTH,
            height: MODAL_HEIGHT,
            color: MODAL_COLOR,
            alpha: MODAL_ALPHA
        }

        this._container = new Container();
       
        const shape = this._shape.drawRect(paramsShape);
        shape.alpha = MODAL_ALPHA;
        this._container.addChild(shape);

        const title  = new Text(
            `Game Over.Score: ${lines.length} lines.`,
            {
                fontFamily : MODAL_TITLE_FONT_FAMILY, 
                fontSize: MODAL_TITLE_FONT_SIZE, 
                fill : MODAL_TITLE_FONT_COLOR
            }
        ); 
        title.x = shape.width / 2 - title.width / 2;
        title.y = MODAL_TITLE_INITIAL_Y;
        this._container.addChild(title);

        PIXI.Assets.load('../assets/resources/sym_anim.json').then((spritesheet) => {
            let marginY = 0;
            let lastContainerPosY = 0;
            lines.forEach( line => {
                console.log(line.symbolName);
                const container = new Container();
                
                let posX = 0;
                for (let i = 0; i < REELS_COUNT; i++) {
                    const sprite = new PIXI.AnimatedSprite(spritesheet.animations[`sym_${line.symbolName}`]);
                    sprite.width = MODAL_SPRITE_WIDTH,
                    sprite.height = MODAL_SPRITE_HEIGHT;
                    sprite.x = posX;
                    sprite.y = MODAL_SPRITE_INITIAL_Y + marginY;
                    container.addChild(sprite);
                    sprite.play();
                    posX += MODAL_ROW_SYMBOL_MARGIN_X;
                    lastContainerPosY = sprite.y;
                }
                container.x = shape.width / 2 - container.width / 2;
                this._container.addChild(container);
                
                marginY += MODAL_ROW_MARGIN_Y;

            });
           
            const btnParams = {
                label: 'Play Again',
                x: shape.width / 2 - MODAL_BTN_WIDTH / 2,
                y: lastContainerPosY + MODAL_PLAY_BTN_MARGIN_Y,
                width: MODAL_BTN_WIDTH,
                height: MODAL_PLAY_BTN_HEIGHT
            };
            if (!lastContainerPosY) {
                btnParams.y = MODAL_PLAY_BTN_INITIANAL_Y;
            }
            this._button.create(btnParams);
            const playAgainBtn =  this._button.getContainer();
            playAgainBtn.alpha = 1;
            this._container.addChild(playAgainBtn);
            playAgainBtn.once('click', () => {
                const gamePlayAgainEvent = new CustomEvent("playAgain", {
                    bubbles: true,
                });
                
                const canvas = document.querySelector('canvas');
                canvas.dispatchEvent(gamePlayAgainEvent);
            });
			
		});
	}

    setPosition (x, y) {
        this._container.x = x;
        this._container.y = y;
    }

    getContainer () {
        return this._container;
    }

    getButton () {
        return this._button;
    }

    showPlayAgainBtn () { 
        this.playAgainBtn.alpha = 1;
    }

}

export default Modal;