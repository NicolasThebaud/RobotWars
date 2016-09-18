import snabbdom from "snabbdom";
import h from "snabbdom/h";
import classes from "snabbdom/modules/class";
import style from "snabbdom/modules/style";

const container = document.getElementById("main");
const context = container.getContext("2d");
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

let maxHeight = parseInt(window.getComputedStyle(document.body).height, 10) * 0.9;
let maxWidth = parseInt(window.getComputedStyle(document.body).width, 10) * 0.9;

container.width = maxWidth;
container.height = maxHeight;
container.style.width = maxWidth;
container.style.height = maxHeight;

function render(state) {
    let pixelSize = 20;

    context.fillStyle = "#fff";
    context.fillRect(0, 0, maxHeight, maxWidth);

    context.fillStyle = "#000";
    context.fillRect(state.exit.x * pixelSize, state.exit.y * pixelSize, pixelSize, pixelSize);

    state
        .players
        .forEach(bot => {
            context.fillStyle = colors[bot.team];

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
            //context.fillRect(bot.position.x * pixelSize, bot.position.y * pixelSize, pixelSize, pixelSize)
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

    if (state.winner) {
        let congrats = document.createElement("div");
        congrats.id = "congrats";
        congrats.innerHTML = `<div class="middle">
            <span class="team" style="background-color: ${colors[state.winner]}"></span> team wins
        </div>`;

        document.body.appendChild(congrats);
    }
}

module.exports = render;
