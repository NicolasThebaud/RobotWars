import snabbdom from "snabbdom";
import h from "snabbdom/h";
import classes from "snabbdom/modules/class";
import style from "snabbdom/modules/style";

let context;
let playersInfoPanel;
const pixelSize = 20;

let previousDOM;

const patch = snabbdom.init([
    classes,
    style
]);

let colors = [
    "rgb(203, 30, 30)",
    "rgb(30, 99, 203)",
    "rgb(47, 180, 38)",
    "rgb(191, 156, 5)"
];

function init(mapSize) {
    const container = document.getElementById("main");
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
        .forEach(bot => {
            context.fillStyle = colors[bot.team];
            context.font = "15px sans-serif";

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
            context.fillText(bot.name, bot.position.x * pixelSize, (bot.position.y + 1.5) * pixelSize);
            //context.fillRect(bot.position.x * pixelSize, bot.position.y * pixelSize, pixelSize, pixelSize)
        });

    function playerRenderer(winner) {
        return player => h("tr.player", { class: { winner: winner }}, [
            h("td", [player.name + " "]),
            h("td", [h("span.team", { style: { "background-color": colors[player.team] }})]),
            h("td.errors", [player.errors.length + " errors"])
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

    if (state.winner) {
        let congrats = document.createElement("div");
        congrats.id = "congrats";
        congrats.innerHTML = `<div class="middle">
            <span class="team" style="background-color: ${colors[state.winner]}"></span> Win!
        </div>`;

        document.getElementById("canvas").appendChild(congrats);
    }
}

module.exports = {
    init,
    render
};
