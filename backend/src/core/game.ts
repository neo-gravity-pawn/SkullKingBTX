import { 
    NotEnoughPlayersError } from './error';
import { Player } from "@core/player";
import { merge, Subject, Subscription } from 'rxjs';
import { Phase } from './phase';
import { EstimatePhase } from './estimatePhase';
import { PlayPhase } from './playPhase';

export class Game {
    private players = Array<Player>();
    private round = 1;
    private phaseSubject = new Subject<Phase>();
    private phases!: Array<Phase>;
    private phaseFinishedSubscription!: Subscription;
    private phaseCounter = 0;
    public phase$ = this.phaseSubject.asObservable();

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

}