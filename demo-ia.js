var demoIa = {
    getName: function () {
        return "Felix";
    },

    onFriendFindExit: function (exit) {

    },

    onResponseX: function (position) {
        console.log(position);
    },

    onResponseY: function (position) {
    },

    action: function () {
        let move = {
            action: "move",
            params: { x: 0.5 - Math.random(), y: 0.5 - Math.random() }
        };
        let ask = {
            action: "ask",
            params: "x"
        }
        return move;
    }
}

module.exports = demoIa;
