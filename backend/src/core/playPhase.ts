// handle active player
// provide a hand to each player
// should contain deck & trick
// checks on play if active player is valid
// provides async feedback streams: currently active player, was last play action valid
// if all finished, counting phase

import { Player } from '@core/player';
import { Phase, PhaseEvent } from '@core/phase';
import { 
    CardCannotBePlayedError,
    NotActivePlayerError} from '@core/error';
import { Deck } from './deck';
import { Trick } from './trick';
import { canBeAddedToTrickRule, getHighestCardInTrickRule } from './rules';

export interface ITrickResult {
    winningPlayer: Player,
    extraPoints: number
}

export class TrickFinishedEvent extends PhaseEvent {
    constructor(phase: Phase, public trickResult: ITrickResult ) {
        super(phase);
    }
}

export interface IPlayPhaseState {
    state: string,
}

export class PlayPhase extends Phase{

    private activePlayer!: Player;
    private trick!: Trick;
    private nrOfCompletedTrick = 0;

    onInit() {
        this.activePlayer = this.players[(this.round - 1) % this.players.length];
        this.nrOfCompletedTrick = 0;
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
        } else {
            throw new CardCannotBePlayedError(player.hand.getCard(handCardIndex));
        }
        
        this.setNextPlayer();
        this.checkIfTrickIsComplete();
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
            player.hand.sort();
        })
    }

    private checkIfTrickIsComplete(): void {
        if (this.trick.getNumberOfCards() === this.players.length) {
            const info = getHighestCardInTrickRule(this.trick);
            const winningPlayer = this.trick.getPlayerForCard(info.highestCardIndex);
            this.trick = new Trick(); // ATTENTION Trick content is lost
            this.activePlayer = winningPlayer;
            this.sendEventLater(new TrickFinishedEvent(this, {
                winningPlayer,
                extraPoints: info.extraPoints
            }))
            this.nrOfCompletedTrick += 1;
            if (this.nrOfCompletedTrick === this.round) {
                this.finishCurrentPhase();
            }

        }
    }
}