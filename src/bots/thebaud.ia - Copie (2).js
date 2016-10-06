var AI = {
	win: { b:false, pos:{} },
	shouldGoUp: true,
	getName: function() { return "Nico3" },
	onFriendWins: function(exit) { Object.assign(this.win, { b: true, pos: exit }) },
	onResponseY: function (position) { this.shouldGoUp = !(position===0) },
	action: function (position, mapSize, round) {
		let action = {}
		if(this.win.b) action = { action: "teleport", params: { x: this.win.pos.x, y: this.win.pos.y }}
		else if(round===0) action = { action: "teleport", params: { x: 0, y: mapSize-1 }}
		else {
			if(this.shouldGoUp)
				switch(round%2) {
					case 0: action = { action: "move", params: { dx: 0, dy: -1 }}; break;
					case 1: action = { action: "ask", params: this.shouldGoUp ? "y" : "X" }; break;
				}
			else action = { action: "move", params: { dx: 1, dy: 0 }}
		}
		return action
	}
}
module.exports = AI