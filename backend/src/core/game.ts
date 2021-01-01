import { NotEnoughPlayersError } from './error';
import { Player } from "@core/player";
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Phase } from './phase';
import { EstimatePhase } from './estimatePhase';
import { ITrickResult, PlayPhase } from './playPhase';
import { ScoreBoard } from './scoreBoard';

export class Game {
    private players = Array<Player>();
    private round = 1;
    private phaseSubject = new Subject<Phase>();
    private phases!: Array<Phase>;
    private phaseFinishedSubscription!: Subscription;
    private trickFinishedSubscription!: Subscription;
    private phaseCounter = 0;
    private scoreBoard!: ScoreBoard;
    private scoreBoardSubject = new Subject<ScoreBoard>();
    public scoreBoardUpdate$ = this.scoreBoardSubject.asObservable();

    get numberOfPlayers(): number {
        return this.players.length;
    }

    addPlayer(player: Player): void {
       this.players.push(player); 
    }

    public start(): void {
        if (this.numberOfPlayers < 2) {
            throw new NotEnoughPlayersError(this.numberOfPlayers);
        }
        this.scoreBoard = new ScoreBoard(this.players);
        this.scoreBoard.setRound(this.round);
        this.setupPhases();
        this.initCurrentPhase();
    }

    private setupPhases(): void {
        this.phaseCounter = 0;
        this.phases = [
            new EstimatePhase(this.players),
            new PlayPhase(this.players),
        ]
        this.phaseFinishedSubscription ? this.phaseFinishedSubscription.unsubscribe() : null;
        this.phaseFinishedSubscription = merge(
            this.phases[0].finishedForCurrentRound$,
            this.phases[1].finishedForCurrentRound$
        ).subscribe( (phase: Phase) => {
            this.onPhaseEnd(phase);
            this.phaseCounter += 1;
            this.phaseCounter = this.phaseCounter % this.phases.length;
            this.initCurrentPhase();
        })
        const pp = this.phases[1] as PlayPhase;
        this.trickFinishedSubscription ? this.trickFinishedSubscription.unsubscribe() : null;
        this.trickFinishedSubscription = pp.currentTrickComplete$.subscribe( (result: ITrickResult) => {
            this.scoreBoard.enterTrick(result.winningPlayer, result.extraPoints);
            this.scoreBoardSubject.next(this.scoreBoard);
        })
    }

    private initCurrentPhase(): void {
        const phase = this.phases[this.phaseCounter];
        phase.initForRound(this.round);
        setTimeout(_ => this.phaseSubject.next(phase), 0);
    }

    private onPhaseEnd(phase: Phase): void {
        this.ifPhaseIs(EstimatePhase, phase, (phase: EstimatePhase) => {
            this.players.forEach((player: Player) => {
                this.scoreBoard.setEstimate(player, phase.getEstimateForPlayer(player));
            })
            this.scoreBoardSubject.next(this.scoreBoard);
        })
        this.ifPhaseIs(PlayPhase, phase, (phase: PlayPhase) => {
            this.round += 1;
            this.scoreBoard.setRound(this.round);
        })
    }

    private ifPhaseIs<T>(c : {new(...args: any[]): T}, phase: Phase, f: (phase: T) => void) {
        if (phase instanceof c) {
            f(phase as unknown as T);
        }
    }

    public getPhase$<T>(c : {new(...args: any[]): T}): Observable<T> {
        return this.phaseSubject.asObservable().pipe(
            filter(e => e instanceof c),
            map(e => (e as unknown as T))
        );
    }
}