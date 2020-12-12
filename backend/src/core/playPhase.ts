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
import { Deck } from './deck';


export class PlayPhase extends Phase{

    private activePlayerIndex: number | undefined;
    private activePlayer: Player | undefined;


    onInit() {
        this.activePlayerIndex = (this.round - 1) % this.players.length;
        this.activePlayer = this.players[this.activePlayerIndex];
        this.dealCards();
    }

    public play(player: Player, handCardIndex: number): void {
        this.checkIfActionValidForPlayer(player);
        if (player !== this.activePlayer) {
            throw new NotActivePlayerError(player, this.activePlayer ? this.activePlayer : new Player('UNDEFINED'));
        }
    }

    private dealCards(): void {
        const deck = new Deck();
        deck.shuffle();
        this.players.forEach(player => {
            player.resetHand();
            for(let r = 0; r < this.round; r++) {
                player.hand.addCard(deck.removeCard(0))
            }
        })
    }

}