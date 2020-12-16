import { Card } from './card';
import { CardCollection } from '@core/cardCollection';
import { Player } from '@core/player';
export class Trick extends CardCollection {
    cardPlayerMap = new Array<Player>();
    constructor() {
        super();
    }

    public addCard(card: Card, player: Player): void {
        super.addCard(card);
        this.cardPlayerMap.push(player);
    }

    public getPlayerForCard(index: number): Player {
        return this.cardPlayerMap[index];
    }

    public removeCard(index: number) : Card {
        this.cardPlayerMap.splice(index, 1);
        return super.removeCard(index);
    }
}