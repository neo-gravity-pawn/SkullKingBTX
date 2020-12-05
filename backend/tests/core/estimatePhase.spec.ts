import { expect } from 'chai';
import { EstimatePhase } from '@core/estimatePhase';
import 'mocha';
import { Player } from '@core/player';
import { NotEnoughPlayersError, RoundOutsideRangeError } from '@core/error';

let p1: Player;
let p2: Player;
let phase: EstimatePhase;

const setup = () => {
    p1 = new Player('Bob');
    p2 = new Player('Lisa');
    phase = new EstimatePhase([p1, p2], 1);
}

describe('estimatePhase', () => {
    it('should take the current round and all players as input', () => {
        setup();
        expect(() => {
            phase = new EstimatePhase([], 1);
        }).to.throw(NotEnoughPlayersError);
        expect(() => {
            phase = new EstimatePhase([p1], 1);
        }).to.throw(NotEnoughPlayersError);
        expect(() => {
            phase = new EstimatePhase([p1, p2], 0);
        }).to.throw(RoundOutsideRangeError);
        expect(() => {
            phase = new EstimatePhase([p1, p2], 11);
        }).to.throw(RoundOutsideRangeError);
    })
    it('should provide an estimation interface', () => {
        setup();
        
    })

});