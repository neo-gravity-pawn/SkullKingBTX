import { Card, CardColor } from "./card";

export class CardCollection {
    protected cards: Array<Card>;
    protected colorCount = {
        [CardColor.red]: 0,
        [CardColor.blue]: 0,
        [CardColor.yellow]: 0,
        [CardColor.black]: 0,
        [CardColor.none]: 0
    }
    constructor() {
        this.cards = new Array<Card>();
    }

    public getNumberOfCards(color?: CardColor) {
        const nr = color ? this.colorCount[color] : this.cards.length
        return nr;
    }

    public getCard(index: number) {
        if (index < 0 || index >= this.cards.length) {
            throw Error('Card collection can only provide cards within range [0, '+this.cards.length + ']');
        }
        return this.cards[index];
    }

    public addCard(card: Card, parameters?: any) {
        this.cards.push(card);
        this.colorCount[card.color]++;
    }

    public removeCard(index: number) {
        const card = this.cards.splice(index, 1)[0];
        this.colorCount[card.color]--;
        return card;
    }
}