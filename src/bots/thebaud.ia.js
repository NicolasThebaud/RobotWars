/* Author: Nicolas THEBAUD*/
var AI = {
	win: {prewin: true,b:false, pos:{}},
	up: true,
	getName: function() { return "Nico" },
	onFriendWins: function(pos) { Object.assign(this.win, {prewin: true, b: true, pos: pos}) },
	onResponseY: function (pos) { this.up = !(pos==0) },
	action: function (pos, size, round) {
		let action = {}
		if(this.win.b) {
			let flag = this.win.pos.x==0
			if(this.win.prewin) action = {action: "teleport", params: {x: flag ? this.win.pos.x+1 : this.win.pos.x-1, y: this.win.pos.y}}, this.win.prewin=false
			else action = {action: "move", params: {dx: flag ? -1 : 1, dy: 0}}
		}
		else if(round==0) action = {action: "teleport", params: {x: size-1, y: size-1}}
		else switch(round%2) {
			case 0: action = {action: "move", params: this.up ? { dx: 0, dy: -1 } : { dx: -1, dy: 0 }}; break;
			case 1: action = {action: "ask", params: this.up ? "y" : "X"}; break;
		}
		return action
	}
}
module.exports = AI