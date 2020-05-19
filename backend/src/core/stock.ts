import { MutableCard, MutableCardType } from './mutableCard';
import { Card, CardColor, CardType } from "./card";

export class Stock {
    private cards: Array<Card>;
    constructor() {
        this.cards = new Array<Card>();
        this.addColorCards();
        this.addOtherCards();
    }

    private addColorCards() {
        const colors = [CardColor.red, CardColor.blue, CardColor.yellow, CardColor.black];
        colors.forEach( (color: CardColor) => {
            for (let value = 1; value <= 13; value ++) {
                this.cards.push(
                    new Card({type: (color === CardColor.black) ? CardType.trump : CardType.color , color, value })
                );
            }
        })      
    }

    private addOtherCards() {
        for (let i = 0; i < 5; i++) {
            this.cards.push(new Card({type: CardType.pirate}));
            this.cards.push(new Card({type: CardType.escape}));
        }
        for (let i = 0; i < 2; i++) {
            this.cards.push(new Card({type: CardType.mermaid}));
        }
        this.cards.push(new Card({type: CardType.skullking}));
        this.cards.push(new MutableCard(MutableCardType.scaryMary,
            [new Card({type: CardType.pirate}), new Card({type: CardType.escape})]
        ));
    }

    public getNumberOfCards() {
        return this.cards.length;
    }

    public getCard(index: number) {
        if (index < 0 || index >= this.cards.length) {
            throw Error('Stock can only provide cards within range [0, '+this.cards.length + ']');
        }
        return this.cards[index];
    }
}