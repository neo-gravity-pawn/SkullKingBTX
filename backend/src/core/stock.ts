import { CardCollection } from '@core/cardCollection';
import { MutableCard, MutableCardType } from './mutableCard';
import { Card, CardColor, CardType } from "./card";

export class Stock extends CardCollection {
    constructor() {
        super();
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
}