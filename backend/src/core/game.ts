import { Player } from "@core/player";
import { Subject } from 'rxjs';

export enum GamePhase {
    melding = 'MELDING',
    playing = 'PLAYING'
}

export class Game {
    players = Array<Player>();
    round = 1;
    currentPlayerIndex = -1;
    meldings = new Array<Array<{player: Player, nrOfTricks: number}>>();
    addPlayer(player: Player) {
       this.players.push(player); 
    }
    phaseSubject = new Subject<GamePhase>();
    public phase$ = this.phaseSubject.asObservable();
    
    public start() {
        if (this.numberOfPlayers < 2) {
            throw(`Not enough players (at least 2) to start game. Current number: ${this.numberOfPlayers}`);
        }
        this.currentPlayerIndex = Math.floor(Math.random() * this.numberOfPlayers);
        this.meldings[this.round] = new Array<{player: Player, nrOfTricks: number}>();
        this.phaseSubject.next(GamePhase.melding);
    }

    public meld(player : Player, nrOfTricks: number) {
        if (this.players.indexOf(player) === -1) {
            throw(`${player.name} is not registered as player`);
        }
        if (nrOfTricks > this.round || nrOfTricks < 0) {
            throw(`Melded tricks must be in [0, ${this.round}], given: ${nrOfTricks}`);
        }
        if (this.meldings[this.round].filter( v => v.player === player).length !== 0) {
            throw(`${player.name} has already melded for this round`);
        }
        this.meldings[this.round].push({player, nrOfTricks});
        if (this.meldings[this.round].length === this.players.length) {
            this.phaseSubject.next(GamePhase.playing);
        }
    }

    get numberOfPlayers() {
        return this.players.length;
    }

    get registeredPlayers() {
        return this.players;
    }

    get activePlayer() : Player {
        return this.players[this.currentPlayerIndex];
    }

    get currentRound() : number {
        return this.round;
    }

    getMelding(player: Player) {
        return this.meldings[this.round]
        .filter( v => v.player === player)
        .map(v => v.nrOfTricks)[0];
    }

}