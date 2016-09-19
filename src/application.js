const game = require("./game");
const renderConsole = require("./renderConsole");
const renderDOM = require("./renderDOM");

const req = require.context("./bots", true, /^(.*\.(js$))$/igm);
const ias = req.keys().map(function(key) {
    return req(key);
});

(function main() {
    let state = game.init(ias);

    renderDOM.init(state.mapSize);
    function step() {
        state = game.update(state);
        if (typeof window !== "undefined") {
            renderDOM.render(state);
        } else {
            renderConsole(state);
        }
        if (state.winner) {
            return;
        }
        setTimeout(step, 60);
    }

    step();
}());
