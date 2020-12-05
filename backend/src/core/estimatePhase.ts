import { Player } from '@core/player';
import { NotEnoughPlayersError, RoundOutsideRangeError } from '@core/error';

export class EstimatePhase {
    constructor(private players: Array<Player>, private round: number) {
        if (this.players.length < 2) {
            throw new NotEnoughPlayersError(this.players.length);
        }
        if (this.round <1 || this.round > 10) {
            throw new RoundOutsideRangeError(this.round);
        }
    };
}