import { Card } from "./card";

export class Stock {
    private cards: Array<Card>;
    constructor() {
        this.cards = new Array<Card>();
    }

    public getNumberOfCards() {
        return this.cards.length;
    }
}