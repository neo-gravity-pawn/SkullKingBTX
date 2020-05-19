import { Card } from './card';

export enum MutableCardType {
    scaryMary
}

export class MutableCard extends Card {
    private cards: Array<Card>;
    private mType: MutableCardType;
    private selectedCardIndex = 0;
    constructor(type: MutableCardType, cards: Array<Card>) {
        super();
        this.cards = cards;
        this.setConfiguration();
        this.mType = type;
    }

    private setConfiguration() {
        this.configuration = this.cards[this.selectedCardIndex].conf;
    }

    public selectCard(index: number) {
        this.selectedCardIndex = index;
        this.setConfiguration();
    }

    get mutableType() {
        return this.mType;
    }
}

export function isMutableCard(card: Card) {
    return (card instanceof MutableCard)
}