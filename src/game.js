function initPlayer(ia) {
    return {
        position: {
            x: 0,
            y: 0
        },
        name: ia.getName(),
        ia: ia,
        errors: [],
        tpLeft: 2
    };
}

function addError(player, error) {
    player.errors.push(error);
    console.error(`[ERROR] ${player.name} -> ${error}`);
    return player;
}

function createTeamDispatcher(nbTeams) {
    return function dispatch(player, index) {
        return Object.assign({}, player, {
            team: index % nbTeams
        });
    };
}

function groupByTeam(teams, player) {
    teams[player.team] = teams[player.team] || [];
    teams[player.team].push(player);
    return teams;
}

function protectIaMethod(subject, methodName) {
    if (!subject.ia[methodName]) {
        return function () {};
    }
    return function () {
        let res = false;
        try {
            res = subject.ia[methodName].apply(subject.ia, arguments);
        } catch (e) {
            addError(subject, e.message);
        }
        return res;
    }
}

var actions = {
    move: function move(subject, moves, env) {
        var clone = Object.assign({}, subject);
        if (moves.dx === undefined || moves.dy === undefined) {
            return addError(clone, "[MOVE] missing dx or dy param");
        }
        for (let i of ["x", "y"]) {
            if (moves[i] !== 0) {
                let newPos = clone.position[i] + (moves["d" + i] > 0 ? 1 : -1);
                clone.position[i] = newPos;
            }
        }

        return clone;
    },

    teleport: function teleport(subject, position, env) {
        if (subject.tpLeft <= 0) {
            return subject;
        }
        if (position.x === undefined || position.y === undefined) {
            return addError(subject, "[TELEPORT] missing x or y param");
        }
        var clone = Object.assign({}, subject);
        clone.tpLeft--;
        console.log(position);
        clone.position = position;
        return clone;
    },

    ask: function ask(subject, question, env) {
        let subPos = subject.position[question];
        let exitPos = env.exit[question];

        let status = 0;
        if (subPos === exitPos) {
            status = 0;
        } else {
            status = subPos > exitPos ? -1 : 1;
        }

        protectIaMethod(subject, "onResponse" + question.toUpperCase())(status);
        return subject;
    }
};

function execute({ action, params, subject, env }) {
    if (!action) { return subject; }
    var fn = actions[action];
    if (!fn) {
        addError(subject, `[ACTION] no action ${action}`);
        return subject;
    }
    return fn(subject, params, env);
}

function stateChecker(mapSize) {
    return function checkState(player) {
        let newPosition = Object.assign({}, player.position);
        let maxIndex = mapSize - 1;

        newPosition.x = Math.max(Math.min(newPosition.x, maxIndex), 0);
        newPosition.y = Math.max(Math.min(newPosition.y, maxIndex), 0);

        if (newPosition.x !== player.position.x || newPosition.y !== player.position.y) {
            addError(player, "[MOVE] out of bounds");
        }
        player.position = newPosition;

        return player;
    }
}

var game = {
    init: function (ias) {
        var nbTeams = [2, 3, 4].reduce((acc, val) => {
            if (ias.length % val === 0 || ias.length % val === 1) {
                return val;
            }
            return acc;
        }, 1);

        var mapSize = Math.max(ias.length * 2, 20);

        var exit = {
            x: Math.round(mapSize / 2) + Math.floor(Math.random() * (mapSize / 2)),
            y: Math.round(mapSize / 2) + Math.floor(Math.random() * (mapSize / 2))
        }

        var players = ias
            .map(initPlayer)
            .map(createTeamDispatcher(nbTeams));

        var teams = players.reduce(groupByTeam, {});

        return {
            players: players,
            teams: teams,
            exit: exit,
            mapSize: mapSize,
            winners: [],
            winnersByTeam: {},
            nbTeams: nbTeams,
            round: 0
        };
    },

    update: function (state) {
        function not(fn) {
            return function () {
               return !fn.apply(null, arguments);
            }
        }
        function isWinner(exit) {
            return (player) => player.position.x === exit.x && player.position.y === exit.y;
        }
        var updatedPlayers = state
            .players
            .map(bot => {
                let friendsPosition = state.players
                    .filter(p => p.team === bot.team)
                    .map(p => ({ x: p.position.x, y: p.position.y }));

                let action = protectIaMethod(bot, "action")
                    ({ x: bot.position.x, y: bot.position.y }, state.mapSize, state.round, friendsPosition);
                return {
                   action: action.action,
                   params: action.params,
                   subject: bot,
                   env: state
               };
            })
            .map(execute)
            .map(stateChecker(state.mapSize));

        var roundWinners = updatedPlayers
            .filter(isWinner(state.exit))

        roundWinners.forEach((winner) => {
            state.teams[winner.team].forEach((player) => {
                protectIaMethod(player, "onFriendWins")(state.exit);
            });
        });

        var winners = state.winners.concat(roundWinners);

        var winnersByTeam = winners.reduce(groupByTeam, {});

        var winningTeam = Object.keys(winnersByTeam).reduce(function (winningTeam, team) {
            var won = winnersByTeam[team].length === state.teams[team].length;
            return winningTeam || (won ? team : false);
        }, false);

        return Object.assign({}, state, {
            players: updatedPlayers.filter(not(isWinner(state.exit))),
            winners: winners,
            winnersByTeam: winnersByTeam,
            winner: winningTeam,
            round: state.round + 1
        });
    }
};

module.exports = game;
