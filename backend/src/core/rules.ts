import { Trick } from '@core/trick';
import { Card, CardType } from './card';
import { CardCollection } from '@core/cardCollection';

export function canBeAddedToTrickRule(hand: CardCollection, cardIndex: number, trick: Trick): Boolean {
    const card = hand.getCard(cardIndex);
    if (card.type !== CardType.color && card.type !== CardType.trump) {
        return true;
    }
    for (let i = 0; i < trick.getNumberOfCards(); i++) {
        const trickCard = trick.getCard(i);
        if (trickCard.type === CardType.color || trickCard.type === CardType.trump) {
            if (card.color !== trickCard.color) {
                const nrOfFittingCards = hand.getNumberOfCards(trickCard.color);
                if (nrOfFittingCards !== 0) {
                    return false;
                }
            }
            return true;
        }
    }
    return true;
}

export function getHighestCardInTrickRule(trick: Trick) {
    const cardOrder = [
        CardType.escape,
        CardType.color,
        CardType.trump,
        CardType.mermaid,
        CardType.pirate,
        CardType.skullking
    ]
    if (trick.getNumberOfCards() === 0) {
        return -1;
    }
    let currentHighestCardIndex = 0;
    let currentHighestCard = trick.getCard(currentHighestCardIndex);
    for (let i = 1; i < trick.getNumberOfCards(); i++) {
        const card = trick.getCard(i);
        if (currentHighestCard.type === CardType.color) {
            if (card.color === currentHighestCard.color && card.value > currentHighestCard.value) {
                currentHighestCard = card;
                currentHighestCardIndex = i;
            }
        }
    }
    return currentHighestCardIndex;
}