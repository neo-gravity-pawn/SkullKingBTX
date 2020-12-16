import { 
    NotEnoughPlayersError } from './error';
import { Player } from "@core/player";
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Phase } from './phase';
import { EstimatePhase } from './estimatePhase';
import { PlayPhase } from './playPhase';

export enum GamePhase {
    estimate = 'ESTIMATING',
    play = 'PLAYING'
}

export interface IPhaseInfo {
    phaseType: GamePhase,
    phase: Phase
}

export class Game {
    private players = Array<Player>();
    private round = 1;
    private currentPhase!: Phase;
    private phaseSubject = new Subject<IPhaseInfo>();
    private estimatePhase!: EstimatePhase;
    private playPhase!: PlayPhase;
    private currentPhaseFinished!: Promise<any>;
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
        this.initEstimatePhase();
        // this.initPlayPhase();
    }

    private setupPhases() {
        this.estimatePhase = new EstimatePhase(this.players);
        this.playPhase = new PlayPhase(this.players);
    }

    private async initEstimatePhase() {
        this.currentPhase = this.estimatePhase;
        this.currentPhase.finishedForCurrentRound$.subscribe( _ => {
            this.initPlayPhase();
        })
        this.setupCurrentPhase(GamePhase.estimate);

        // await this.currentPhaseFinished;
    }

    private initPlayPhase() {
        this.currentPhase = this.playPhase;
        this.setupCurrentPhase(GamePhase.play);
    }

    private setupCurrentPhase(phaseType: GamePhase) {
        this.currentPhase.initForRound(this.round);
        this.currentPhaseFinished = this.currentPhase.finishedForCurrentRound$.pipe(take(1)).toPromise();
        this.phaseSubject.next({phaseType, phase: this.currentPhase});
    }

}