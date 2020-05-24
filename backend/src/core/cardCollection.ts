import { isMutableCard, MutableCard } from '@core/mutableCard';
import { printCard } from '@helper/output';
import { Card, CardType } from "./card";

const cardTypeOrder = [
    CardType.skullking,
    CardType.scarymary,
    CardType.pirate,
    CardType.mermaid,
    CardType.trump,
    CardType.color,
    CardType.escape
]

export class CardCollection {
    protected cards: Array<Card>;
    constructor() {
        this.cards = new Array<Card>();
    }

    public getNumberOfCards() {
        return this.cards.length;
    }

    public getCard(index: number) {
        if (index < 0 || index >= this.cards.length) {
            throw Error('Card collection can only provide cards within range [0, '+this.cards.length + ']');
        }
        return this.cards[index];
    }

    public addCard(card: Card) {
        this.cards.push(card);
    }

    public removeCard(index: number) {
        const card = this.cards.splice(index, 1);
        return card[0];
    }

    public shuffle() {
        // Fisher-Yates shuffle
        // https://javascript.info/task/shuffle
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
          }
    }

    public sort() {
        this.cards.sort((a, b) => {
            const aType = isMutableCard(a) ? (a as MutableCard).mutableType : a.type;
            const bType = isMutableCard(b) ? (b as MutableCard).mutableType : b.type;
            return (cardTypeOrder.indexOf(aType) - cardTypeOrder.indexOf(bType));
        });
    }
}