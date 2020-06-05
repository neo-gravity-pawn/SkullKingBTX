import { Trick } from './trick';
import { Player } from "@core/player";
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export enum GamePhase {
    melding = 'MELDING',
    playing = 'PLAYING'
}

export interface IGamePhaseInfo {
    phase: GamePhase,
    game: Game
}

export class Game {
    players = Array<Player>();
    trick = new Trick();
    round = 1;
    currentPlayerIndex = -1;
    currentStartingPlayerIndex = -1;
    meldings = new Array<Array<{player: Player, nrOfTricks: number}>>();
    addPlayer(player: Player) {
       this.players.push(player); 
    }
    phaseSubject = new Subject<IGamePhaseInfo>();
    public phase$ = this.phaseSubject.asObservable();
    public playPhase$: Observable<Game> = this.phase$.pipe(
        filter((pI: IGamePhaseInfo) => pI.phase === GamePhase.playing),
        map((pI: IGamePhaseInfo) => pI.game)
    );
    public meldPhase$: Observable<Game> = this.phase$.pipe(
        filter((pI: IGamePhaseInfo) => pI.phase === GamePhase.melding),
        map((pI: IGamePhaseInfo) => pI.game)
    );
    
    public start() {
        if (this.numberOfPlayers < 2) {
            throw(`Not enough players (at least 2) to start game. Current number: ${this.numberOfPlayers}`);
        }
        this.currentStartingPlayerIndex = Math.floor(Math.random() * this.numberOfPlayers);
        this.currentPlayerIndex = this.currentStartingPlayerIndex;
        this.initMelding();
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
            this.emitPhase(GamePhase.playing);
            this.initPlaying();
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

    private initMelding() {
        this.meldings[this.round] = new Array<{player: Player, nrOfTricks: number}>();
        this.emitPhase(GamePhase.melding);
    }

    private emitPhase(phase: GamePhase) {
        this.phaseSubject.next({phase, game: this});
    }

    private selectNextStartingPlayer() {
        this.currentStartingPlayerIndex += 1;
        this.currentStartingPlayerIndex = (this.currentStartingPlayerIndex >= this.players.length) ? 0 : this.currentStartingPlayerIndex;
    }

    private initPlaying() {
        this.selectNextStartingPlayer();
    }

}