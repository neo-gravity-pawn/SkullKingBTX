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
import { Trick } from './trick';
import { canBeAddedToTrickRule } from './rules';


export class PlayPhase extends Phase{

    private activePlayer!: Player;
    private trick!: Trick;


    onInit() {
        this.activePlayer = this.players[(this.round - 1) % this.players.length];
        this.dealCards();
        this.trick = new Trick();
    }

    public getActivePlayer() {
        return this.activePlayer;
    }

    public play(player: Player, handCardIndex: number): void {
        this.checkIfActionValidForPlayer(player);
        if (player !== this.activePlayer) {
            throw new NotActivePlayerError(player, this.activePlayer);
        }
        if (canBeAddedToTrickRule(player.hand, handCardIndex, this.trick)) {
            this.trick.addCard(player.hand.removeCard(handCardIndex), player);
        }
        this.setNextPlayer();
    }

    public getTrick(): Trick {
        return this.trick;
    }

    private setNextPlayer() {
        const index = (this.players.indexOf(this.activePlayer) + 1) % this.players.length;
        this.activePlayer = this.players[index];
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