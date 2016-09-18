var demoIa = {
    getName: function () {
        return "Bot" + Math.round(Math.random() * 100);
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

    action: function () {
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
        return move;
    }
}

module.exports = demoIa;
