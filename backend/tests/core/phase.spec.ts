import { expect } from 'chai';
import { Phase } from '@core/phase';
import 'mocha';
import { Player } from '@core/player';
import { EstimateOutsideRangeError, NotEnoughPlayersError, PhaseNotInitializedError, PlayerHasAlreadyEstimatedError, PlayerNotRegisteredError, RoundOutsideRangeError } from '@core/error';

const p1 = new Player('Bob');
const p2 = new Player('Lisa');
const p3 = new Player('Heinz');



describe('Phase', () => {
    it('should take the current round and all players', () => {
        let phase = new Phase([p1, p2]);
        expect(() => {
            phase = new Phase([]);
        }).to.throw(NotEnoughPlayersError);
        expect(() => {
            phase = new Phase([p1]);
        }).to.throw(NotEnoughPlayersError);

    })

    it ('should check round bounds on init', () => {
        const phase = new Phase([p1, p2]);
        expect(() => {
            phase.initForRound(0);
        }).to.throw(RoundOutsideRangeError);
        expect(() => {
            phase.initForRound(11);
        }).to.throw(RoundOutsideRangeError);
    })

    it ('should return current round', () => {
        const phase = new Phase([p1, p2]);
        phase.initForRound(7);
        expect(phase.getRound()).to.equal(7);
    })


    // tests for the valid actions check are implemented
    // for derived class estimatePhase, as they are 
    // protected and won't be exposed for the test

});