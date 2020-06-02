import { Player } from "@core/player";

export enum GamePhase {
    melding = 'MELDING',
    playing = 'PLAYING'
}

export class Game {
    players = Array<Player>();
    phase = GamePhase.melding;
    round = 1;
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

    get activePlayer() : Player {
        return this.players[this.currentPlayerIndex];
    }

    get currentPhase() : GamePhase {
        return this.phase;
    }

    get currentRound() : number {
        return this.round;
    }

}