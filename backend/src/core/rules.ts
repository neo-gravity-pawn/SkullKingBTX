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
    const cardOrder = [
        CardType.escape,
        CardType.color,
        CardType.trump,
        CardType.mermaid,
        CardType.pirate,
        CardType.skullking
    ]
    if (trick.getNumberOfCards() === 0) {
        return [-1, 0];
    }
    let pirateCount = 0;
    let mermaidIndex = -1;
    let skullkingIndex = -1;
    let extraPoints = 0;
    let mermaidTriggered = false;

    function updateStates(card: Card, index: number) {
        if (card.type === CardType.pirate) {
            pirateCount++;
        }
        if (card.type === CardType.mermaid && mermaidIndex === -1) {
            mermaidIndex = index;
        }
        if (card.type === CardType.skullking) {
            skullkingIndex = index;
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
            if ((cardOrder.indexOf(card.type) > cardOrder.indexOf(currentHighestCard.type)) || (card.type === CardType.mermaid && skullkingIndex !== -1)) {
                if (!mermaidTriggered) {
                    if ((card.type === CardType.skullking && mermaidIndex !== -1) || (card.type === CardType.mermaid && skullkingIndex !== -1)) {
                        setCardAsHighest(trick.getCard(mermaidIndex), mermaidIndex);
                        extraPoints = 50;
                        mermaidTriggered = true;
                    } else {
                        setCardAsHighest(card, i);
                    }
                }
            }
        }
        if (currentHighestCard.type === CardType.skullking) {
            extraPoints = pirateCount * 30;
        }
    }
    return [currentHighestCardIndex, extraPoints];
}