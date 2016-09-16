const game = require("./game");
const demoIa = require("./demoIa");
const renderConsole = require("./renderConsole");
const renderDOM = require("./renderDOM");

(function main() {
    let state = game.init([demoIa, demoIa, demoIa, demoIa, demoIa]);

    function step() {
        state = game.update(state);
        if (typeof window !== "undefined") {
            renderDOM(state);
        } else {
            renderConsole(state);
        }
        if (state.winner) {
            return;
        }
        setTimeout(step, 500);
    }

    step();
}());
