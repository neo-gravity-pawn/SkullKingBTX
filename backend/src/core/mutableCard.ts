import { Card } from './card';

export class MutableCard extends Card {
    private cards: Array<Card>;
    constructor(cardA: Card, cardB: Card) {
        super();
        this.cards = [cardA, cardB];
        this.configuration = {
            type: this.cards[0].type,
            value: this.cards[0].value,
            color: this.cards[0].color
        }
    }
}