import { Card } from './card';

export class MutableCard extends Card {
    private cards: Array<Card>;
    private selectedCardIndex = 0;
    constructor(cards: Array<Card>) {
        super();
        this.cards = cards;
        this.setConfiguration();
    }

    private setConfiguration() {
        this.configuration = this.cards[this.selectedCardIndex].conf;
    }

    public selectCard(index: number) {
        this.selectedCardIndex = index;
        this.setConfiguration();
    }
}