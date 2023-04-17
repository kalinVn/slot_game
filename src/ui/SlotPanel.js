import {Container} from "pixi.js";
import {
        SYMBOLS_URL, SYMBOL_WIDTH, SYMBOL_HEIGHT, REEL_MAX_SYMBOLS, SLOT_PANEL_REEL_X_POS, SLOT_PANEL_COLOR, INITIAL_DURATION_TIME,
        REELS_COUNT, REELS_PARAMS, TIME_STEP_SIZE, MAX_SYMBOL_POS, SLOT_PANEL_WIDTH, SLOT_PANEL_HEIGHT, INITIAL_TIME, REEL_SPRITE_COUNT,
        MAX_SYMBOL_IN_SET
    } from '../config';
import {gsap} from "gsap";
import Modal from "./Modal.js";


class SlotPanel {

    constructor () {
        this._container;
        this._matrix;
        this._score;
        this._model;
    }
    
    async create () {
        this._matrix = [];
        this._score = {
            lines: []
        }
        this._container = new Container();
        this._container.width = SLOT_PANEL_WIDTH;
        this._container.height = SLOT_PANEL_HEIGHT;
        this._container.background  = SLOT_PANEL_COLOR;
        
        let xPosReel = 0;
        for (let i = 0; i < REELS_COUNT; i++) {
            const reelContainer = new Container();
            reelContainer.x = xPosReel;
            reelContainer.y = -SYMBOL_WIDTH;
            let xPos = 0;
            let yPos = 0;
            const currentReel = [];
            this._matrix[i] = [];
            for (let j = 0; j < REEL_MAX_SYMBOLS; j++) {
                const randomSymbolIndex = Math.floor(Math.random() * 3);
                
                const url = SYMBOLS_URL[randomSymbolIndex];
                const texture =  PIXI.Texture.from(url);
                const sprite = PIXI.Sprite.from(texture);
                if (randomSymbolIndex == 0) {
                    sprite.name = "lemon"
                } else if (randomSymbolIndex == 1) {
                    sprite.name = "orange"
                } if (randomSymbolIndex == 2) {
                    sprite.name = "plum"
                }
                sprite.width = SYMBOL_WIDTH;
                sprite.height = SYMBOL_HEIGHT;
                sprite.x = xPos;
                sprite.y = yPos;
                reelContainer.addChild(sprite);
                this._matrix[i].push(sprite);
                currentReel.push({
                    container: reelContainer,
                    currentIndex: randomSymbolIndex
                });
                yPos += SYMBOL_HEIGHT;
            }
            xPosReel += SLOT_PANEL_REEL_X_POS;
            this._container.addChild(reelContainer);
        }
    }

    async play () {
        this.duration = INITIAL_DURATION_TIME;
        this._completed = false;
        this.time = INITIAL_TIME;
        for (let i = 0; i < REELS_COUNT; i++) {
            const reel = this._matrix[i];
            reel.forEach( async symbol => {
                const params = REELS_PARAMS[i];
                const duration = params.duration;
                
                await this._updateSymbols(reel, params, duration, this.time);
            });
        }
    }

    gameEnd () {
        this._modal = new Modal();
        const lines = this._score.lines;
        const params = {
            lines: lines
        };
        this._modal.create(params);
        const posX =  0;
        this._modal.setPosition(posX, 100)
        this._container.addChild(this._modal.getContainer());
    }

    getContainer () {
        return this._container;
    }

    getModal () {
        return this._modal;
    }

    async _updateSymbols (reel, params, duration, time) {
        if ( time < 140 ) {
            duration = 0.4;
        }
        if ( time < 120 ) {
            duration = 0.6;
        }
        
        reel.forEach(async (symbol) => {
            await this._update(reel, symbol, params, duration, time);
        });
    }

    async _update (reel, symbol, params, duration, time) {
        const posY = params.posY;
        
        await gsap.to(symbol, {y: posY, duration: duration, ease: "none", repeatRefresh:true, onComplete: () => {this._onComplete(reel, symbol, params, duration, time)}});
    }

    async _onComplete (reel, symbol, params, duration, time) {
        
        if (symbol.y >= MAX_SYMBOL_POS) {
            symbol.y = 0;
            time -= 5;
            this.time -= TIME_STEP_SIZE;
            if (this._completed) {
                return;
            }
            if (this.time < 0) {
                this._completed = true;
               
                
                setTimeout( () => {
                    const sortedMatrix = this._matrix.map( reel => {
                       reel = reel.sort((symbolA, symbolB) => symbolA.y - symbolB.y);
                       return reel;
                    });
                    
                    for (let i = 1; i < REEL_SPRITE_COUNT; i++) {
                        const row = [];
                        let rowSet;
                        for (let j = 0; j < REELS_COUNT; j++) {
                            row.push(sortedMatrix[j][i].name);
                            console.log(row);
                            rowSet = new Set(row);
                        }

                        if (rowSet) {
                            if (rowSet.size < 2) {
                                this._score.lines.push({
                                    lineIndex: i,
                                    symbolName: row[0]
                                });

                                
                            }
                        }
                    }

                    const gameEndEvent = new CustomEvent("gameEnd", {
                        bubbles: true,
                    });
                    
                    const canvas = document.querySelector('canvas');
                    canvas.dispatchEvent(gameEndEvent);
                }, 1000);
                
                return;
            }
            
            await this._updateSymbols(reel, params, duration, time);
            
        }
    }

}

export default SlotPanel;