import { 
    NotEnoughPlayersError, 
    PhaseNotInitializedError, 
    PlayerNotRegisteredError, 
    RoundOutsideRangeError } from "@core/error";
import { Player } from "@core/player";
import { Subject } from "rxjs";


export class PhaseEvent {
    constructor(public phase: Phase) {}
}

export class PhaseFinishedEvent extends PhaseEvent {
    
}

export class Phase {
    
    private eventSubject = new Subject<PhaseEvent>();    
    public event$ = this.eventSubject.asObservable();
    protected round = 0;

    constructor(protected players: Array<Player>) {
        if (this.players.length < 2) {
            throw new NotEnoughPlayersError(this.players.length);
        }
    };

    public initForRound(round: number) {
        if (round <1 || round > 10) {
            throw new RoundOutsideRangeError(round);
        }
        this.round = round;
        this.onInit();
    }

    public getRound() {
        return this.round;
    }

    protected onInit() {
        // can be overidden by subclass
    }

    protected checkIfActionValidForPlayer(player: Player) {
        this.checkIfPhaseIsInitialized();
        this.checkIfPlayerIsValid(player);
    }

    protected checkIfPlayerIsValid(player: Player) {
        if (this.players.indexOf(player) === -1) {
            throw new PlayerNotRegisteredError(player);
        }
    }

    protected checkIfPhaseIsInitialized() {
        if (this.round === 0) {
            throw new PhaseNotInitializedError();
        }
    }

    protected sendEvent(event: PhaseEvent) {
        this.eventSubject.next(event);
    }

    protected sendEventLater(event: PhaseEvent) {
        setTimeout( _ => this.sendEvent(event), 0);
    }

    protected finishCurrentPhase() {
        this.sendEventLater(new PhaseFinishedEvent(this));
    }

}