import { Hand } from '@core/hand';
export class Player {
    hand = new Hand();
    constructor(private playerName: string) {}
    get name() {
        return this.playerName;
    }
}