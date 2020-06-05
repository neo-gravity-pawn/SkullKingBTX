import { Player } from "./player";

class BaseError extends Error {
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
      this.stack = (new Error()).stack; 
      Object.setPrototypeOf(this, BaseError.prototype);
    }
}

export class NotActivePlayerError extends BaseError {
    constructor(private givenPlayer: Player, private activePlayer: Player) {
        super(`${givenPlayer.name} is not the active player. Active player: ${activePlayer.name}`);
        Object.setPrototypeOf(this, NotActivePlayerError.prototype);
    }
    get activePlayerName() {
        return this.activePlayer.name;
    }
}

