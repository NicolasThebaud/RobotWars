let colors = [
    31,
    32,
    34,
    33,
    36
]
function render(state) {
    var map = [];
    for (let x = 0; x < state.mapSize; x++) {
        for (let y = 0; y < state.mapSize; y++) {
            map[x] = map[x] || [];
            map[x][y] = "█";
        }
    }

    map[state.exit.x][state.exit.y] = " ";
    state.players.forEach(bot => map[bot.position.x][bot.position.y] = "\u001b[" + colors[bot.team] + "m•\u001b[0m");

    console.log("\x1B[2J");
    console.log(map.map(line => line.join(" ")).join("\n"));
    if (state.winners.length) {
        console.log(state.winners.map(w => w.name));
    }
    if (state.winner) {
        console.log(state.winner + " team wins");
    }
    console.log(state.players.map(player => player.name + " " + player.errors.length + " errors"));
}

module.exports = {
    init: function () {},
    render: render,
};
