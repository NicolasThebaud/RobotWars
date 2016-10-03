var game = require("./game");
var renderConsole = require("./renderConsole");
var renderDOM = require("./renderDOM");

var isBrowser = typeof window !== "undefined";

var req = require.context("./bots", true, /^(.*\.(js$))$/igm);
var ias = req.keys().map(function(key) {
    return req(key);
});

let gameState = {
    paused: isBrowser,
    fps: isBrowser ? 1 : 4
};

if (isBrowser) {
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
}

var renderer = isBrowser ? renderDOM : renderConsole;

(function main() {
    let state = game.init(ias);

    renderer.init(state.mapSize);
    renderer.render(state);

    function step() {
        if (!gameState.paused) {
            state = game.update(state);
            renderer.render(state);
            if (state.winner) {
                return;
            }
        }
        setTimeout(step, 1000 / gameState.fps);
    }

    step();
}());
