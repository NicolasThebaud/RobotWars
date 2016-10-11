/* Author: Nicolas THEBAUD*/
var AI = function() {
	var privateProps = new WeakMap()
	privateProps.set(this, {
		winData: {
			prewin_turn: true,
			winningCondition: false, 
			pos:{}
		},
		shouldGoUp: true,
		moves: {
			"BASE_MV": {
				action: "move", 
				params: { 
					dx: -1, 
					dy: 0 
				}
			},
			"BASE_MV_UP": {
				action: "move", 
				params: { 
					dx: 0, 
					dy: -1 
				}
			},
			"BASE_ASK_Y": {
				action: "ask", 
				params: "y"
			}
		},
		getStartTP: function(mapSize) {
			return {
				action: "teleport", 
				params: {
					x: mapSize-1, 
					y: mapSize-1
				}
			}
		},
		getWinTP: function(isDoorLeftmost) {
			return {
				action: "teleport", 
				params: {
					x: isDoorLeftmost ? this.winData.pos.x+1 : this.winData.pos.x-1, 
					y: this.winData.pos.y
				}
			}
		},
		getWinMove: function(isDoorLeftmost) {
			return {
				action: "move", 
				params: {
					dx: isDoorLeftmost ? -1 : 1, 
					dy: 0
				}
			}
		}
	})

	this.getName = function getName() { 
		return "Nico" 
	}

	this.onFriendWins = function onFriendWins(pos) {
		Object.assign(privateProps.get(this).winData, {
			prewin_turn: true, 
			winningCondition: true, 
			pos: pos
		}) 
	}

	this.onResponseY = function onResponseY(pos) { 
		privateProps.get(this).shouldGoUp = !(pos==0) 
	}

	this.action = function action(pos, mapSize, round) {
		let action = {},
			instance = privateProps.get(this),
			winData = instance.winData,
			moves = instance.moves

		if(winData.winningCondition) {
			let isDoorLeftmost = winData.pos.x==0
			if(winData.prewin_turn) {
				action = instance.getWinTP(isDoorLeftmost)
				winData.prewin_turn = false
			} else {
				action = instance.getWinMove(isDoorLeftmost)
			}
		} else if(round==0) {
			action = instance.getStartTP(mapSize)
		} else {
			switch(round%2) {
				case 0: 
					action = instance.shouldGoUp ? moves.BASE_MV_UP : moves.BASE_MV
					break;
				case 1: 
					action = instance.shouldGoUp ? moves.BASE_ASK_Y : moves.BASE_MV
					break;
			}
		}
		return action
	}
}

module.exports = new AI()