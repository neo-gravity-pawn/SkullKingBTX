import { printCard } from '@helper/output';
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

export function getHighestCardInTrickRule(trick: Trick) : [number, number] {
    const cardOrder =  {
        [CardType.escape]: 0,
        [CardType.color]: 1,
        [CardType.trump]: 2,
        [CardType.mermaid]: 3,
        [CardType.pirate]: 4,
        [CardType.scarymary]: 4,
        [CardType.skullking]: 5,
    }
    if (trick.getNumberOfCards() === 0) {
        return [-1, 0];
    }
    let pirateCount = 0;
    let mermaidIndex = -1;
    let skullkingIndex = -1;
    let extraPoints = 0;

    function updateStates(card: Card, index: number) {
        if (card.type === CardType.pirate) {
            pirateCount++;
        }
        if (card.type === CardType.mermaid) {
            if (mermaidIndex === -1) {
                mermaidIndex = index;
            }
            if (skullkingIndex !== -1) {
                cardOrder[card.type] = 6;
                extraPoints = 50;         
            }
        }
        if (card.type === CardType.skullking) {
            skullkingIndex = index;
            if (mermaidIndex !== -1) {
                cardOrder[CardType.mermaid] = 6;
                extraPoints = 50;
                setCardAsHighest(trick.getCard(mermaidIndex),mermaidIndex);
            }

        }
    }

    function setCardAsHighest(card: Card, index: number) {
        currentHighestCard = card;
        currentHighestCardIndex = index;
    }

    let currentHighestCardIndex = 0;
    let currentHighestCard = trick.getCard(currentHighestCardIndex);
    updateStates(currentHighestCard, 0);

    for (let i = 1; i < trick.getNumberOfCards(); i++) {
        const card = trick.getCard(i);
        updateStates(card, i);
        if (currentHighestCard.type === card.type) {
            if (card.type === CardType.color || card.type === CardType.trump) {
                if (card.color === currentHighestCard.color && card.value > currentHighestCard.value) {
                    setCardAsHighest(card, i);
                }
            }
        } else {
            if (cardOrder[card.type] > cardOrder[currentHighestCard.type]) {
                setCardAsHighest(card, i);
            }
        }
        if (currentHighestCard.type === CardType.skullking) {
            extraPoints = pirateCount * 30;
        }
    }
    return [currentHighestCardIndex, extraPoints];
}