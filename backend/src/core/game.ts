import { NotEnoughPlayersError } from './error';
import { Player } from "@core/player";
import { merge, Subject, Subscription } from 'rxjs';
import { Phase, PhaseEvent, PhaseFinishedEvent } from './phase';
import { EstimatePhase } from './estimatePhase';
import { ITrickResult, PlayPhase, TrickFinishedEvent } from './playPhase';
import { ScoreBoard } from './scoreBoard';

export class GameEvent {
    constructor(public scoreBoard: ScoreBoard) {
    }
}

export class ScoresUpdatedEvent extends GameEvent {
}

export class PhaseChangedEvent extends GameEvent {
    constructor(public newPhase: Phase, scoreBoard: ScoreBoard) {
        super(scoreBoard);
    }
}

export class GameFinishedEvent extends GameEvent {
}

export class TrickCompleteEvent extends GameEvent {
    constructor(public trickResult: ITrickResult, scoreBoard: ScoreBoard) {
        super(scoreBoard);
    }
}

export class Game {
    private players = Array<Player>();
    private round = 1;
    private maxRounds = 10;
    private phases!: Array<Phase>;
    private phaseEventSubscription!: Subscription;
    private phaseCounter = 0;
    private scoreBoard!: ScoreBoard;
    private gameHasEnded = false;
    private eventSubject = new Subject<GameEvent>();
    public event$ = this.eventSubject.asObservable();

    get numberOfPlayers(): number {
        return this.players.length;
    }

    addPlayer(player: Player): void {
       this.players.push(player); 
    }

    getPlayers(): Array<Player> {
        return this.players;
    }

    public start(): void {
        if (this.numberOfPlayers < 2) {
            throw new NotEnoughPlayersError(this.numberOfPlayers);
        }
        this.round = 1;
        this.scoreBoard = new ScoreBoard(this.players);
        this.scoreBoard.setRound(this.round);
        this.gameHasEnded = false;
        this.setupPhases();
        this.initCurrentPhase();
    }

    private setupPhases(): void {
        this.phaseCounter = 0;
        this.phases = [
            new EstimatePhase(this.players),
            new PlayPhase(this.players),
        ]
        this.phaseEventSubscription ? this.phaseEventSubscription.unsubscribe() : null;
        this.phaseEventSubscription = merge(
            this.phases[0].event$,
            this.phases[1].event$
        ).subscribe( (event: PhaseEvent) => {
            if (event instanceof PhaseFinishedEvent) {
                this.onPhaseEnd(event.phase);
                if (!this.gameHasEnded) {
                    this.phaseCounter += 1;
                    this.phaseCounter = this.phaseCounter % this.phases.length;
                    this.initCurrentPhase();
                }
            }
            if (event instanceof TrickFinishedEvent) {
                this.scoreBoard.enterTrick(event.trickResult.winningPlayer, event.trickResult.extraPoints);
                this.sendEvent(new ScoresUpdatedEvent(this.scoreBoard));
                this.sendEvent(new TrickCompleteEvent(event.trickResult, this.scoreBoard));
            }
        })
    }

    private sendEvent(event: GameEvent) {
        this.eventSubject.next(event);
    }

    private initCurrentPhase(): void {
        const phase = this.phases[this.phaseCounter];
        this.scoreBoard.setRound(this.round);
        phase.initForRound(this.round);
        this.sendEvent(new PhaseChangedEvent(phase, this.scoreBoard));
    }

    private onPhaseEnd(phase: Phase): void {
        this.ifPhaseIs(EstimatePhase, phase, (phase: EstimatePhase) => {
            this.players.forEach((player: Player) => {
                this.scoreBoard.setEstimate(player, phase.getEstimateForPlayer(player));
            })
            this.sendEvent(new ScoresUpdatedEvent(this.scoreBoard));
        })
        this.ifPhaseIs(PlayPhase, phase, _ => {
            if (this.round < this.maxRounds) {
                this.round += 1;
            } else {
                this.gameHasEnded = true;
                this.sendEvent(new GameFinishedEvent(this.scoreBoard))
            }
        })
    }

    private ifPhaseIs<T>(c : {new(...args: any[]): T}, phase: Phase, f: (phase: T) => void) {
        if (phase instanceof c) {
            f(phase as unknown as T);
        }
    }
}