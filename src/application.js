var game = require("./game");
var renderConsole = require("./renderConsole");
var renderDOM = require("./renderDOM");

var req = require.context("./bots", true, /^(.*\.(js$))$/igm);
var ias = req.keys().map(function(key) {
    return req(key);
});

let gameState = {
    paused: true,
    fps: 1
};

document
    .getElementById("play-button")
    .addEventListener("click", function () {
        gameState.paused = !gameState.paused
        this.innerText = gameState.paused ? "▶" : "▮▮";
    });

document
    .getElementById("inc-speed")
    .addEventListener("click", () => gameState.fps += 5);

document
    .getElementById("dec-speed")
    .addEventListener("click", () => gameState.fps -= 5);

(function main() {
    let state = game.init(ias);

    renderDOM.init(state.mapSize);
    renderDOM.render(state);

    function step() {
        if (!gameState.paused) {
            state = game.update(state);
            if (typeof window !== "undefined") {
                renderDOM.render(state);
            } else {
                renderConsole(state);
            }
            if (state.winner) {
                return;
            }
        }
        setTimeout(step, 1000 / gameState.fps);
    }

    step();
}());
