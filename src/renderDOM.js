import snabbdom from "snabbdom";
import h from "snabbdom/h";
import classes from "snabbdom/modules/class";
import style from "snabbdom/modules/style";

const container = document.getElementById("main").getContext("2d");
const playersInfoPanel = document.getElementById("players-info");

let previousDOM;

const patch = snabbdom.init([
    classes,
    style
]);

let colors = [
    "rgb(203, 30, 30)",
    "rgb(30, 99, 203)",
    "rgb(47, 180, 38)",
    "rgb(180, 38, 158)"
];

function render(state) {
    let pixelSize = 10;

    container.fillStyle = "#fff";
    container.fillRect(0, 0, 100, 100);

    container.fillStyle = "#000";
    container.fillRect(state.exit.x * pixelSize, state.exit.y * pixelSize, pixelSize, pixelSize);

    state
        .players
        .forEach(bot => {
            container.fillStyle = colors[bot.team];

            container.beginPath();
            container.arc(
                (0.5 + bot.position.x) * pixelSize,
                (0.5 + bot.position.y) * pixelSize,
                pixelSize / 2,
                0,
                2 * Math.PI,
                false
            );
            container.fill();
            //container.fillRect(bot.position.x * pixelSize, bot.position.y * pixelSize, pixelSize, pixelSize)
        });

    function playerRenderer(winner) {
        return player => h("tr.player", { class: { winner: winner }}, [
            h("td", [player.name + " "]),
            h("td", [h("span.team", { style: { "background-color": colors[player.team] }})]),
            h("td", [player.errors + " errors"])
        ]);
    }

    const playersInfo = h(
        "table",
        [h("tbody", []
            .concat(state.winners.map(playerRenderer(true)))
            .concat(state.players.map(playerRenderer(false)))
        )]
    );

    let dom = previousDOM ? previousDOM : playersInfoPanel;

    previousDOM = patch(dom, playersInfo);
}

module.exports = render;
