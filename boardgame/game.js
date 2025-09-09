const config = window.GAME_CONFIG || {
  table: { width: 3600, height: 1622 },
  resources: { stone: 20, cinders: 14, gold: 10, wood: 20 }
};

const assets = new Assets(ASSETS);

class Game {
	constructor(params) {
		const {
			gameId,
			playersCount,
			random
		} = params;
		this.gameId = gameId;
		this.random = this.createRandom(+gameId);

		const resources = this.shuffleArray([
			[...Array(config.resources.stone)].map(() => 'Stone'),
			[...Array(config.resources.cinders)].map(() => 'Cinders'),
			[...Array(config.resources.gold)].map(() => 'Gold'),
			[...Array(config.resources.wood)].map(() => 'Wood'),
		].flat());

		this.table = new Table({
			gameId,
			width: config.table.width,
			height: config.table.height
		});

		const MainBoard = assets.get('MainBoard', {
			x: config.table.width / 2,
			y: 300,
			align: ['center', 'top']
		});

		MainBoard.add(
			assets.getList('GateCards').slice(0, 6), 'GatesSupply'
		);

		/*
		const PlayerBoard1 = assets.get('PlayerBoard', {
			x: 434,
			y: 710,
		});
		PlayerBoard1.add(assets.get('GuardTiles1'), 'GuardTiles');
		PlayerBoard1.add(assets.get('LabourerTiles1'), 'LabourerTiles');
		PlayerBoard1.add(assets.get('FarmerTiles1'), 'FarmerTiles');
		PlayerBoard1.add(assets.get('TraderTiles1'), 'TraderTiles');
		PlayerBoard1.add(assets.get('ElderTiles1'), 'ElderTiles');

		const PlayerBoard2 = assets.get('PlayerBoard', {
			x: TABLE_WIDTH - 434,
			y: 710,
		});
		PlayerBoard2.add(assets.get('GuardTiles2'), 'GuardTiles');
		PlayerBoard2.add(assets.get('LabourerTiles2'), 'LabourerTiles');
		PlayerBoard2.add(assets.get('FarmerTiles3'), 'FarmerTiles');
		PlayerBoard2.add(assets.get('TraderTiles1'), 'TraderTiles');
		PlayerBoard2.add(assets.get('ElderTiles3'), 'ElderTiles');
		*/


		this.table.add([
			MainBoard,
			// PlayerBoard1,
			// PlayerBoard2
		]);
	}
	createRandom(value) {
		return () => {
	    value ^= value << 13;
	    value ^= value >> 17;
	    value ^= value << 5;
	    return (value >>> 0) / 4294967296;
	  }
	}
	randomRange(min, max) {
		return min + (max - min) * this.random();
	}
	randomIntRange(min, max) {
		return Math.floor(min + (max - min + 1) * this.random());
	}
	shuffleArray(array) {
	  for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(this.random() * (i + 1));
	    [array[i], array[j]] = [array[j], array[i]];
	  }
	  return array;
	}
}

const game = new Game({
	gameId: (location.hash || (location.hash = '1234567890123456')).slice(1),
	playersCount: 2
});
