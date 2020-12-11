// handle active player
// provide a hand to each player
// should contain deck & trick
// checks on play if active player is valid
// provides async feedback streams: currently active player, was last play action valid
// if all finished, counting phase

import { Player } from '@core/player';
import { Phase } from '@core/phase';
import { 
    NotActivePlayerError} from '@core/error';

export class PlayPhase extends Phase{

    private activePlayerIndex: number | undefined;
    private activePlayer: Player | undefined;


    onInit() {
        this.activePlayerIndex = (this.round - 1) % this.players.length;
        this.activePlayer = this.players[this.activePlayerIndex];
    }

    public play(player: Player, handCardIndex: number) {
        this.checkIfActionValidForPlayer(player);
        if (player !== this.activePlayer) {
            throw new NotActivePlayerError(player, this.activePlayer ? this.activePlayer : new Player('UNDEFINED'));
        }
    }

}