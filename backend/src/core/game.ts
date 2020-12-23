// IDEA: have the score board separate and update it depending
// on phase outcome
// if the playphase starts: set the estimates
// if a trick is completed: update the points
// question:
// should points be accumulated on the scoreboard
// or in the game and added at the end? (i guess in the scoreboard, as it allows to show
// intermediate results)
// kind of an "add trick function" should be added to scoreboard

import { NotEnoughPlayersError } from './error';
import { Player } from "@core/player";
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Phase } from './phase';
import { EstimatePhase } from './estimatePhase';
import { PlayPhase } from './playPhase';
import { ScoreBoard } from './scoreBoard';

export class Game {
    private players = Array<Player>();
    private round = 1;
    private phaseSubject = new Subject<Phase>();
    private phases!: Array<Phase>;
    private phaseFinishedSubscription!: Subscription;
    private phaseCounter = 0;
    private scoreBoardSubject = new Subject<ScoreBoard>();
    public scoreBoardUpdate$ = this.scoreBoardSubject.asObservable();

    get numberOfPlayers() {
        return this.players.length;
    }

    addPlayer(player: Player) {
       this.players.push(player); 
    }

    public start() {
        if (this.numberOfPlayers < 2) {
            throw new NotEnoughPlayersError(this.numberOfPlayers);
        }
        this.setupPhases();
        this.initCurrentPhase();
    }

    private setupPhases() {
        this.phaseCounter = 0;
        this.phases = [
            new EstimatePhase(this.players),
            new PlayPhase(this.players),
        ]
        this.phaseFinishedSubscription ? this.phaseFinishedSubscription.unsubscribe() : null;
        this.phaseFinishedSubscription = merge(
            this.phases[0].finishedForCurrentRound$,
            this.phases[1].finishedForCurrentRound$
        ).subscribe( _ => {
            this.phaseCounter += 1;
            this.initCurrentPhase();
        })
    }

    private initCurrentPhase() {
        const phase = this.phases[this.phaseCounter];
        phase.initForRound(this.round);
        this.phaseSubject.next(phase);
    }

    public getPhase$<T>(c : {new(...args: any[]): T}): Observable<T> {
        return this.phaseSubject.asObservable().pipe(
            filter(e => e instanceof c),
            map(e => (e as unknown as T))
        );
    }
}