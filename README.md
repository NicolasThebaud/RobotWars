# RobotWars

![](http://i.giphy.com/qoxM1gi6i0V9e.gif)

Note: This game was originally developped by [Atomrc](https://github.com/atomrc)

It was developped for a JS lecture, at 'IUT de Nantes' (France)


# ------- Original ReadMe --------

The idea is to create an AI to fight other player's AIs

The goal is simple: **find the exit**, randomly placed within a `n`x`n` pixels map

AIs will be teamed up as the game begins. The game stops once every player in a team found the exit

## Gameplay

Every turn, the game asks AIs what they want to do.

Your AI can answer by one of those actions :

- `move`
- `ask`
- `teleport`

In more 'technical' terms, the game calls the `action` method of an AI, which will return an object containing two keys, `action` & `params`, to define the action to process.

That method should look like this: 

```javascript
{
    action: function action(position, mapSize, round) {
        //Your logic goes here

        return actionObject; //the object to be returned as an action
    }
}
```

Every call to `action` will be provided 3 parameters:

- `position` `{Object}` the player's position ;
- `mapSize` `{Number}` the map's size (duh) ;
- `round` `{Number}` the current turn.

### action - `move`

The `move` action allows the player to move on the map. The game is expecting this object:

```javascript
{
    action: "move",
    params: {
        dx: 0, //1 is forward, -1 backwards; 0 means don't move along this axis
        dy: 0
    }
}
```
Parameters `dx` & `dy` determine the direction the player wants to move to. The player can only move **1** cell at a time; One does not simply put `10` to move further, it won't work.

### action - `ask`

You can ask the game where your bot is compared to the exit. You can only ask about **1** axis at a time.

The game is expecting this object:

```javascript
{
    action: "ask",
    params: "x" //or y
}
```

The game will then answer by calling a method of your AI. depending on the axis you asked, the methods `onResponseX` or `onResponseY` will be called consequently.

```javascript
{
    //...
    onResponseX: function onResponseX(position) {
        //position indicates you wether you're on the exit's left, right, or on the same column
    }
}
```

### action - `teleport`

You can teleport anywhere you want on the map (unless it's outside the boundaries of course). To do that, use the `teleport` action, by sending this object:

```javascript
{
    action: "teleport",
    params: {
        x: x,
        y: y
    }
}
```

⚠ You can only use `teleport` twice. Subsequent call to `teleport` won't work.

## Communication is key

Pro tips, when a fellow teammate has found the exit, the other members of the team will receive the coordinates of the exit.
The game calls your AI's `onFriendWins` method.

## Watch out for mistakes

The game counts whenever you do a mistake...

- Exceptions, thrown/unhandled by your AI ;
- Actions transferred with bad parameters, of malformed ;
- Out-of-bounds moves, eg. moving forward when you're already on the side of the map, or teleporting to negative coordinates ;

Either way, your bot will be paralyzed for this turn


### Installation

You'll need some to tools to make things work, to install them, execute

    npm install
    
In the project folder's root

### Compilation

The game sources are written using ES6. To ensure compatibility, we use a transpiler to convert it to ES5.

To compile the sources, use

    npm run build

You can also run

    npm run watch

To watch for modification in the code and trigger automated compilation.

### Try it !
To play the game, simply execute the `index.html` file in the root
