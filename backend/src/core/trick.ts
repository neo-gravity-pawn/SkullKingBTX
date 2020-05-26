import { Card } from './card';
import { CardCollection } from '@core/cardCollection';
export class Trick extends CardCollection {
    constructor() {
        super();
    }

    public addCard(card: Card, playerId: string) {
        super.addCard(card);
    }

}