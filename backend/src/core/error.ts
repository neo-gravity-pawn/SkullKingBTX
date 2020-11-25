import { Player } from "./player";

class BaseError extends Error {
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
      this.stack = (new Error()).stack; 
      Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotActivePlayerError extends BaseError {
    constructor(private givenPlayer: Player, private activePlayer: Player) {
        super(`${givenPlayer.name} is not the active player. Active player: ${activePlayer.name}`);
    }
    get activePlayerName() {
        return this.activePlayer.name;
    }
}

export class NotEnougPlayersError extends BaseError {
    constructor(private numberOfPlayers: number) {
        super(`Not enough players (at least 2) to start game. Current number: ${numberOfPlayers}`)
    }
}

export class PlayerNotRegisteredError extends BaseError {
    constructor(private player: Player) {
        super(`${player.name} is not registered as player`);
    }
}

export class EstimateOutsideRangeError extends BaseError {
    constructor(private currentRound: number, private numberOfTricks: number) {
        super(`Estimated tricks must be in [0, ${currentRound}], given: ${numberOfTricks}`);
    }
}

export class PlayerHasAlreadyEstimatedError extends BaseError {
    constructor(private player: Player) {
        super(`${player.name} has already estimated for this round`);
    }  
}