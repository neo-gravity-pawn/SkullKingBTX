import { Player } from '@core/player';
import { Phase } from '@core/phase';
import { 
    EstimateOutsideRangeError,
    PlayerHasAlreadyEstimatedError} from '@core/error';

export class EstimatePhase extends Phase{
    private estimates = new Array<Array<{player: Player, numberOfTricks: number}>>();

    protected onInit() {
        this.estimates[this.round] = new Array<{player: Player, numberOfTricks: number}>();
    }

    public estimate(player: Player, numberOfTricks: number) {
        this.checkIfActionValidForPlayer(player);
        if (this.getEstimateForPlayer(player) !== undefined) {
            throw new PlayerHasAlreadyEstimatedError(player);
        }
        if (numberOfTricks < 0 || numberOfTricks > this.round) {
            throw new EstimateOutsideRangeError(this.round, numberOfTricks);
        }
        this.estimates[this.round].push({player, numberOfTricks});
        if (this.estimates[this.round].length === this.players.length) {
            this.finishCurrentPhase();
        }
    }

    public getEstimateForPlayer(player: Player) {
        this.checkIfActionValidForPlayer(player);
        return this.estimates[this.round]
        .filter( v => v.player === player)
        .map(v => v.numberOfTricks)[0];
    }

}