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
                x: Math.round(dx),
                y: Math.round(dy)
            }
        };
        let ask = {
            action: "ask",
            params: "x"
        };
        return round % 2 === 0 ? ask : move;
    }
}

module.exports = demoIa;
