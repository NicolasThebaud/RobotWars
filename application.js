const game = require("./game");
const demoIa = require("./demo-ia");
const render = require("./console-renderer");

(function main() {
    let state = game.init([demoIa, demoIa, demoIa, demoIa, demoIa]);

    function step() {
        state = game.update(state);
        render(state);
    }

    setInterval(step, 500);
}());
