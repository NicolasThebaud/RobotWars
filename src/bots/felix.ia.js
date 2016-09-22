var demoIa = {
    getName: function () {
        return "Felix";
    },

    onFriendWins: function (exit) {
        //exit est la position de la sortie { x: .., y: .. }
        console.log(exit);
    },

    onResponseX: function (position) {
        //1 je suis trop à gauche
        //-1 je suis trop à droite
        //0 je suis en face de la sortie
        console.log(position);
    },

    onResponseY: function (position) {
        //1 je suis trop bas
        //-1 je suis trop haut
        //0 je suis en face de la sortie
        console.log(position);
    },

    action: function (position, mapSize, round) {
        var dx = Math.random() * 3 - 1.5;
        var dy = Math.random() * 3 - 1.5;

        let move = {
            action: "move",
            params: {
                dx: Math.round(dx),
                dy: Math.round(dy)
            }
        };
        let ask = {
            action: "ask",
            params: "x"
        };
        let teleport = {
            action: "teleport",
            params: {
                x: Math.round(Math.random() * mapSize),
                y: Math.round(Math.random() * mapSize)
            }
        }
        let action;
        switch (round % 3) {
            case 0:
                action = ask;
                break;
            case 1:
                action = move;
                break;
            case 2:
                action = teleport;
                break;
        }
        return action;
    }
}

module.exports = demoIa;
