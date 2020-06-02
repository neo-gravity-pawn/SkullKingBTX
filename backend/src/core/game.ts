import { Player } from "@core/player";

export class Game {
    players = Array<Player>();
    currentPlayerIndex = -1;
    addPlayer(player: Player) {
       this.players.push(player); 
    }
    
    public start() {
        if (this.numberOfPlayers < 2) {
            throw(`Not enough players (at least 2) to start game. Current number: ${this.numberOfPlayers}`);
        }
        this.currentPlayerIndex = Math.floor(Math.random() * this.numberOfPlayers);

    }

    get numberOfPlayers() {
        return this.players.length;
    }

    get activePlayer() {
        return this.players[this.currentPlayerIndex];

    }

}