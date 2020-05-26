import { Card } from './card';
import { CardCollection } from '@core/cardCollection';
export class Trick extends CardCollection {
    cardPlayerMap = new Array<string>();
    constructor() {
        super();
    }

    public addCard(card: Card, playerId: string) {
        super.addCard(card);
        this.cardPlayerMap.push(playerId);
    }

    public getPlayerIdForCard(index: number) {
        return this.cardPlayerMap[index];
    }
}