import { Player } from './player';
import { CardType, CardColor } from './card';

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

export class NotEnoughPlayersError extends BaseError {
    constructor(private numberOfPlayers: number) {
        super(`Not enough players (at least 2). Current number: ${numberOfPlayers}`)
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

export class CardValueOutsideRangeError extends BaseError {
    constructor(type: CardType, range: Array<number>, value: number) {
        super(`${type} card must have value within ${range} but has ${value}`)
    }
}

export class InvalidColorCardError extends BaseError {
    constructor(type: CardType, color: CardColor) {
        super(`${type} card can not have color ${color}`);
    }
}

export class CardCollectionIndexOutsideRangeError extends BaseError {
    constructor(range: number) {
        super(`Card collection can only provide cards within range [0, ${range}]`);
    }
}

export class NoCardCodeProvidedError extends BaseError {
    constructor() {
        super('no card code provided to cc function');
    }
}

export class MutableCardIndexOutsideRangeError extends BaseError {
    constructor(range: number) {
        super(`Mutable card has only selectable cards within range [0, ${range}]`);
    }
}

export class RoundOutsideRangeError extends BaseError {
    constructor(round: number) {
        super(`Round has to be in [1,10], provided: ${round}`);
    }
}

export class PhaseNotInitializedError extends BaseError {
    constructor() {
        super(`Phase needs to be initialized for current round`);
    }
}
