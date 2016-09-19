var demoIa = {
    getName: function () {
        return "Felix";
    },

    onFriendWins: function (exit) {
        console.log(exit);
    },

    onResponseX: function (position) {
        console.log(position);
    },

    onResponseY: function (position) {
        console.log(position);
    },

    action: function (mapSize, round) {
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
