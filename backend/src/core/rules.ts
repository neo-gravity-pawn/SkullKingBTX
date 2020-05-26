import { printCard } from '@helper/output';
import { Card, CardType } from './card';
import { CardCollection } from '@core/cardCollection';

export function canBeAddedToTrickRule(hand: CardCollection, cardIndex: number, trick: CardCollection): Boolean {
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