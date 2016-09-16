function initPlayer(ia) {
    return {
        position: {
            x: 0,
            y: 0
        },
        name: ia.getName(),
        ia: ia
    };
}

function createTeamDispatcher(nbTeams) {
    return function dispatch(player, index) {
        return Object.assign({}, player, {
            team: index % nbTeams
        });
    };
}

function protectIaMethod(subject, methodName) {
    if (!subject.ia[methodName]) {
        return function () {};
    }
    return function (params) {
        let res = false;
        try {
            res = subject.ia[methodName](params);
        } catch (e) {
            console.error(e);
            subject.errors++;
        }
        return res;
    }
}

var actions = {
    move: function move(subject, moves, env) {
        var clone = Object.assign({}, subject);
        for (let i of ["x", "y"]) {
            if (moves[i] !== 0) {
                let newPos = clone.position[i] + (moves[i] > 0 ? 1 : -1);
                clone.position[i] = Math.min(Math.max(newPos, 0), env.mapSize - 1);
            }
        }

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
    var fn = actions[action];
    if (!fn) {
        console.warn(`no action ${action}`);
    }
    return fn(subject, params, env);
}

var game = {
    init: function (ias) {
        const nbTeams = [2, 3, 4].reduce((acc, val) => {
            if (ias.length % val === 0 || ias.length % val === 1) {
                return val;
            }
            return acc;
        }, 1);

        const mapSize = ias.length * 5;

        const exit = {
            x: Math.floor(Math.random() * mapSize),
            y: Math.floor(Math.random() * mapSize)
        }

        return {
            players: ias
                .map(initPlayer)
                .map(createTeamDispatcher(nbTeams)),
            exit: exit,
            mapSize: mapSize,
            winners: []
        }
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
        state.players = state
            .players
            .map(bot => {
               let action = protectIaMethod(bot, "action")();
               return {
                   action: action.action,
                   params: action.params,
                   subject: bot,
                   env: state
               };
            })
            .map(execute);

        let turnWinners = state
            .players
            .filter(isWinner(state.exit))
            .map(bot => bot.name);

        state.winners = state.winners.concat(turnWinners);

        state.players = state
            .players
            .filter(not(isWinner(state.exit)))

        return state;
    }
};

module.exports = game;
