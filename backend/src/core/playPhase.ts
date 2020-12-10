// handle active player
// provide a hand to each player
// should contain deck & trick
// checks on play if active player is valid
// provides async feedback streams: currently active player, was last play action valid
// if all finished, counting phase

import { Player } from '@core/player';
import { Phase } from '@core/phase';
import { 
    EstimateOutsideRangeError,
    PlayerHasAlreadyEstimatedError} from '@core/error';

export class PlayPhase extends Phase{

    public play(player: Player, handCardIndex: number) {
        this.checkIfActionValidForPlayer(player);
    }

}