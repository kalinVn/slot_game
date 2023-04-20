import {Application} from "pixi.js";
import SlotPanel from './ui/SlotPanel.js';
import ControlPanel from './ui/ControlPanel.js';

class Game {
	
	async init () {
		this._slotPanel;
		this._controlsPanel;

		this.app = new Application( {width : 600, height : 600, backgroundColor: 0x1e1f1d});
		this.app.stage.interactive = true;
		document.body.appendChild(this.app.view);
		
		await PIXI.Assets.load([
			'../assets/resources/sym_anim.png',
			'../assets/resources/sym_lemon.png',
			'../assets/resources/sym_orange.png',
			'../assets/resources/sym_plum.png'
		]);

		await this._create()
	}

	_create () {
		this._createSlotContainer();
		this._controlsPanel = new ControlPanel();
		this._controlsPanel.create();

		this.app.stage.addChild(this._controlsPanel.getContainer());

		this._controlsPanel.getContainer().on('PRESSED', () => {
			this._slotPanel.play()
		});

		this._attachGameEndListener();

		const canvas = document.querySelector('canvas');
		canvas.addEventListener('playAgain', e => {
			this._clear();
		});
	}

	_attachGameEndListener () {
		this._slotPanel.getContainer().on('GAMEEND', () => {
			this._slotPanel.gameEnd();
			this.app.stage.removeChild(this._controlsPanel.getContainer());
		});
	}

	_clear () {
		this.app.stage.removeChild(this._slotPanel.getContainer());
		this._createSlotContainer();
		this._slotPanel.play();
		this._attachGameEndListener();
	}

	_createSlotContainer () {
		this._slotPanel = new SlotPanel();
		this._slotPanel.create();

		const slotPanelContainer = this._slotPanel.getContainer();
		this.app.stage.addChild(slotPanelContainer);
	}
	
}

export default  Game;