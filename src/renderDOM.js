/* global require, module */
var snabbdom = require("snabbdom");
var h = require("snabbdom/h");
var classes = require("snabbdom/modules/class");
var style = require("snabbdom/modules/style");

var context;
var playersInfoPanel;
var pixelSize = 20;

var previousDOM;

var patch = snabbdom.init([
    classes,
    style
]);

var colors = [
    "rgb(203, 30, 30)",
    "rgb(30, 99, 203)",
    "rgb(47, 180, 38)",
    "rgb(191, 156, 5)"
];

function init(mapSize) {
    var container = document.getElementById("main");
    context = container.getContext("2d");
    playersInfoPanel = document.getElementById("players-info")

    container.width = pixelSize * mapSize;
    container.height = pixelSize * mapSize;
    container.style.width = pixelSize * mapSize;
    container.style.height = pixelSize * mapSize;
}

function render(state) {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, context.canvas.height, context.canvas.width);

    context.fillStyle = "#000";
    context.fillRect(state.exit.x * pixelSize, state.exit.y * pixelSize, pixelSize, pixelSize);

    state
        .players
        .forEach(function (bot) {
            context.fillStyle = colors[bot.team];
            context.font = "15px sans-serif";
            context.textAlign = "center";

            context.beginPath();
            context.arc(
                (0.5 + bot.position.x) * pixelSize,
                (0.5 + bot.position.y) * pixelSize,
                pixelSize / 2,
                0,
                2 * Math.PI,
                false
            );
            context.fill();
            context.fillText(bot.name, (bot.position.x + 0.5) * pixelSize, (bot.position.y + 1.7) * pixelSize);
            if (bot.currentAction) {
                context.fillStyle = "black";
                var icons = {
                    move: "\uf047",
                    ask: "\uf128",
                    teleport: "\uf0e7",
                    error: "\uf00d"
                };
                context.font = "20px FontAwesome";
                context.fillText(icons[bot.currentAction], (bot.position.x + 1) * pixelSize, bot.position.y * pixelSize);
            }

            //context.fillRect(bot.position.x * pixelSize, bot.position.y * pixelSize, pixelSize, pixelSize)
        });

    function playerRenderer(winner) {
        var icons = {
            move: "\uf047",
            ask: "\uf128",
            teleport: "\uf0e7",
            error: "\uf00d"
        };
        return function (player) {
            return h("tr.player", { class: { winner: winner }}, [
                h("td", [player.name + " "]),
                h("td", { style: { fontFamily: "FontAwesome" }}, [icons[player.currentAction] || ""]),
                h("td", [h("span.team", { style: { "background-color": colors[player.team] }})]),
                h("td.errors", [player.errors.length + " errors"])
            ]);
        };
    }

    var playersInfo = h(
        "table",
        [h("tbody", []
            .concat(state.winners.map(playerRenderer(true)))
            .concat(state.players.map(playerRenderer(false)))
        )]
    );

    var dom = previousDOM ? previousDOM : playersInfoPanel;

    previousDOM = patch(dom, playersInfo);

    if (state.winner) {
        var congrats = document.createElement("div");
        congrats.id = "congrats";
        congrats.innerHTML = "<div class=\"middle\"><span class=\"team\" style=\"background-color:" + colors[state.winner] + "\"></span> Win! </div>";

        document.getElementById("canvas").appendChild(congrats);
    }
}

module.exports = {
    init,
    render
};
