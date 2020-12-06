import { Player } from '@core/player';
import { 
    EstimateOutsideRangeError,
    NotEnoughPlayersError,
    PhaseNotInitializedError,
    PlayerHasAlreadyEstimatedError,
    PlayerNotRegisteredError,
    RoundOutsideRangeError } from '@core/error';
import { Subject } from 'rxjs';

export class EstimatePhase {
    private estimates = new Array<Array<{player: Player, numberOfTricks: number}>>();
    private round = 0;
    private finishedSubject = new Subject();
    public finishedForCurrentRound$ = this.finishedSubject.asObservable();
    
    constructor(private players: Array<Player>) {
        if (this.players.length < 2) {
            throw new NotEnoughPlayersError(this.players.length);
        }
    };

    public initForRound(round: number) {
        if (round <1 || round > 10) {
            throw new RoundOutsideRangeError(round);
        }
        this.round = round;
        this.estimates[this.round] = new Array<{player: Player, numberOfTricks: number}>();
    }
    
    public estimate(player: Player, numberOfTricks: number) {
        this.checkFunctionPrerequisites(player);
        if (this.getEstimateForPlayer(player) !== undefined) {
            throw new PlayerHasAlreadyEstimatedError(player);
        }
        if (numberOfTricks < 0 || numberOfTricks > this.round) {
            throw new EstimateOutsideRangeError(this.round, numberOfTricks);
        }
        this.estimates[this.round].push({player, numberOfTricks});
        if (this.estimates[this.round].length === this.players.length) {
            this.finishedSubject.next();
        }
    }

    public getEstimateForPlayer(player: Player) {
        this.checkFunctionPrerequisites(player);
        return this.estimates[this.round]
        .filter( v => v.player === player)
        .map(v => v.numberOfTricks)[0];
    }

    private checkFunctionPrerequisites(player: Player) {
        this.checkIfPhaseIsInitialized();
        this.checkIfPlayerIsValid(player);
    }

    private checkIfPlayerIsValid(player: Player) {
        if (this.players.indexOf(player) === -1) {
            throw new PlayerNotRegisteredError(player);
        }
    }

    private checkIfPhaseIsInitialized() {
        if (this.round === 0) {
            throw new PhaseNotInitializedError();
        }
    }
}