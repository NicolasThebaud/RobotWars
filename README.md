#IA War

L'idée est de créer une IA qui va se battre contre tous les autres IA des autres joueurs.

Le principe du jeu est simple : **trouver la sortie** placée au hasard sur une map de `n`x`n` pixels

Les IAs seront affectées à des équipes au lancement du jeu. Le jeu s'arrête une fois que tous les joueurs d'une équipe ont trouvés la sortie

## Déroulement du jeu

A chaque tour, le jeu demandera à votre IA (et celles de tous les autres joueurs) ce qu'elle veut faire à ce tour.

Votre IA pourra répondre l'une de ces deux actions : 

- `move`
- `ask`

D'un côté plus technique, le jeu appellera la méthode `action` de votre IA et votre IA devra retourner un objet qui contient les clés `action` (l'identifiant de l'action que vous voulez réaliser) et `params` les paramètres de l'action.

La méthode principale que vous devrez implémenter ressemblera à ça :

```javascript
{
    action: function action(position, mapSize, round) {
        //à vous de gérer la logique de décision

        return actionObject; //l'objet qui contient l'action que vous voulez exécuter
    }
}
```

A chaque appel de `action` sont passés en paramètres :

- `position` `{Object}` votre position actuelle ;
- `mapSize` `{Number}` la taille de la map ;
- `round` `{Number}` le numéro du tour en cours.

### action `move`

l'action move permet de vous déplacer sur la map. Voila l'objet que le jeu attendra de votre part si vous voulez exécuter l'action move :

```javascript
{
    action: "move",
    params: {
        x: 0, //1 mouvement positif, -1 mouvement négatif, 0 aucun mouvement sur cet axe
        y: 0
    }
}
```

les paramètres `x` et `y` définissent si vous voulez vous déplacer dans le sens positif ou négatif selon l'axe x ou y. Le joueur ne peux que se déplacer que d'une case à la fois, donc mettre une valeur de `10` par exemple ne fera pas avancer plus votre joueur. Le jeu regarde uniquement si la valeur retournée est positive, négative ou nulle.

### action `ask`

Vous pouvez demander au jeu où vous vous trouvez par rapport à la sortie. Vous ne pouvez demander où vous êtes que selon un axe unique (`x` ou `y`)

Pour demander où vous êtes par rapport à la sortie, voila l'objet que le jeu attendra : 

```javascript
{
    action: "ask",
    params: "x" //ou y
}
```

Suite à ça le jeu vous répondra en appelant une méthode de votre IA. Suivant l'axe sur lequel vous lui posez la question il appelera `onResponseX` ou `onResponseY`

```javascript
{
    //...
    onResponseX: function onResponseX(position) {
        // à vous d'enregistrer cette information pour vous en servir au prochain tour
    }
}
```

## Soyez à l'écoute

Petite astuce, quand l'une des IA de votre équipe trouve la sortie, toutes les autres IA de l'équipe sont avertie de la position de la sortie. 
Concrètement, quand l'un de vos alliés gagne, le jeu appel la méthode `onFriendWins` de votre IA. C'est donc à vous de stocker cette information pour tous rusher vers la sortie et ainsi faire gagner l'équipe. 

un exemple d'implémentation serait : 

```javascript
{
    onFriendWins: function storeExit(exit /* = { x: .., y: .. }*/) {
        //garder en mémoire la position de la sortie
    }
}
```

## Attention aux erreurs

Le jeu compte les erreurs que vous faites. Parmis les erreurs, le jeu compte : 

- les exceptions qui sont jettées par votre code ;
- les mouvements en dehors de la carte qui seront demandés (eg. demander à avancer de 1 alors qu'on est en bout de carte).

Dans tous les cas, une erreur va paralyser votre joueur pour le tour en cours.

## Wrapping up

Vous trouverez un exemple d'IA (complétement stupide) à ce chemin `src/bots/felix.ia.js`. Inspirez vous en pour développer votre IA.

## Les main dans le code

### Installation

Vous aurez besoin de quelques outils avant de pouvoir commencer à coder votre IA. Pour les installer, jouer simplement :

    npm install

à la racine du projet.

### Compilation des sources

Les sources du jeu sont écrite en utilisant une syntaxe ES6, pour être complétement sûr de la compatibilité du code, on va utiliser un transpileur pour le convertir en ES5. Pour compiler le code du jeu + celui de votre robot :

    npm run build

Pour ne pas avoir à faire ça à chaque fois que vous faites une modification sur votre IA, pour pouvez lancer la commande :

    npm run watch

qui compilera automatiquement les sources dès qu'il y a un changement dessus.

### Tester votre IA

Pour tester votre IA, vous n'aurez qu'à lancer le jeu en ouvrant le fichier `index.html` à la racine du projet.

### Amusez vous, entraidez vous
