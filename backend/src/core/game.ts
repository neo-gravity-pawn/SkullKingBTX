import { EstimateOutsideRangeError, NotActivePlayerError, NotEnougPlayersError, PlayerHasAlreadyEstimatedError, PlayerNotRegisteredError } from './error';
import { Card } from './card';
import { Trick } from '@core/trick';
import { Player } from "@core/player";
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Deck } from '@core/deck';
import { Hand } from './hand';

export enum GamePhase {
    estimating = 'ESTIMATING',
    playing = 'PLAYING'
}

export interface IGamePhaseInfo {
    phase: GamePhase,
    game: Game
}

export class Game {
    players = Array<Player>();
    trick = new Trick();
    deck = new Deck();
    round = 1;
    currentPlayerIndex = -1;
    currentStartingPlayerIndex = -1;
    estimates = new Array<Array<{player: Player, numberOfTricks: number}>>();
    addPlayer(player: Player) {
       this.players.push(player); 
    }
    phaseSubject = new Subject<IGamePhaseInfo>();
    public phase$ = this.phaseSubject.asObservable();
    public playPhase$: Observable<Game> = this.phase$.pipe(
        filter((pI: IGamePhaseInfo) => pI.phase === GamePhase.playing),
        map((pI: IGamePhaseInfo) => pI.game)
    );
    public estimatePhase$: Observable<Game> = this.phase$.pipe(
        filter((pI: IGamePhaseInfo) => pI.phase === GamePhase.estimating),
        map((pI: IGamePhaseInfo) => pI.game)
    );
    
    public start() {
        if (this.numberOfPlayers < 2) {
            throw new NotEnougPlayersError(this.numberOfPlayers);
        }
        this.currentStartingPlayerIndex = Math.floor(Math.random() * this.numberOfPlayers);
        this.currentPlayerIndex = this.currentStartingPlayerIndex;
        this.initEstimating();
    }


    public estimate(player : Player, numberOfTricks: number) {
        if (this.players.indexOf(player) === -1) {
            throw new PlayerNotRegisteredError(player);
        }
        if (numberOfTricks > this.round || numberOfTricks < 0) {
            throw new EstimateOutsideRangeError(this.round, numberOfTricks);
        }
        if (this.estimates[this.round].filter( v => v.player === player).length !== 0) {
            throw new PlayerHasAlreadyEstimatedError(player);
        }
        this.estimates[this.round].push({player, numberOfTricks});
        if (this.estimates[this.round].length === this.players.length) {
            this.emitPhase(GamePhase.playing);
            this.initPlaying();
        }
    }

    public play(player: Player, cardIndex: number) {
        if (player !== this.activePlayer) {
            throw new NotActivePlayerError(player, this.activePlayer);
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

    getEstimate(player: Player) {
        return this.estimates[this.round]
        .filter( v => v.player === player)
        .map(v => v.numberOfTricks)[0];
    }

    private initEstimating() {
        this.deck = new Deck();
        this.deck.shuffle();
        this.estimates[this.round] = new Array<{player: Player, numberOfTricks: number}>();
        this.setupPlayers();
        this.emitPhase(GamePhase.estimating);
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
    private setupPlayers() {
        this.players.forEach( (p: Player) => {
            p.hand = new Hand();
            for (let i = 0; i < this.round; i++) {
                const c: Card = this.deck.removeCard(0);
                p.hand.addCard(c);
            }
        })

    }

}