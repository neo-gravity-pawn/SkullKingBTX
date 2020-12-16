import { expect } from 'chai';
import { EstimatePhase } from '@core/estimatePhase';
import 'mocha';
import { Player } from '@core/player';
import { EstimateOutsideRangeError, NotEnoughPlayersError, PhaseNotInitializedError, PlayerHasAlreadyEstimatedError, PlayerNotRegisteredError, RoundOutsideRangeError } from '@core/error';

const p1 = new Player('Bob');
const p2 = new Player('Lisa');
const p3 = new Player('Heinz');



describe('estimatePhase', () => {
    it('should take the current round and all players', () => {
        let phase = new EstimatePhase([p1, p2]);
        expect(() => {
            phase = new EstimatePhase([]);
        }).to.throw(NotEnoughPlayersError);
        expect(() => {
            phase = new EstimatePhase([p1]);
        }).to.throw(NotEnoughPlayersError);

    })

    it ('should check round bounds on init', () => {
        const phase = new EstimatePhase([p1, p2]);
        expect(() => {
            phase.initForRound(0);
        }).to.throw(RoundOutsideRangeError);
        expect(() => {
            phase.initForRound(11);
        }).to.throw(RoundOutsideRangeError);
    })

    it('should check if phase was initialized', () => {
        const phase = new EstimatePhase([p1, p2]);
        expect(() => {
            phase.estimate(p1, 1);
        }).to.throw(PhaseNotInitializedError); 
    })

    it('should check if player is valid', () => {

        const phase = new EstimatePhase([p1, p2]);
        phase.initForRound(1);
        expect(() => {
            phase.estimate(p3, 1);
        }).to.throw(PlayerNotRegisteredError); 
    })

    it('should return the estimate for a player', () => {
        const phase = new EstimatePhase([p1, p2]);
        expect( () => {
            phase.getEstimateForPlayer(p1);
        }).to.throw(PhaseNotInitializedError);
        phase.initForRound(1);
        phase.estimate(p1, 1);
        expect(phase.getEstimateForPlayer(p1)).to.equal(1);
        expect(() => {
            phase.getEstimateForPlayer(p3);
        }).to.throw(PlayerNotRegisteredError);
        expect(phase.getEstimateForPlayer(p2)).to.equal(undefined);
    })
    

    it('should check correct and double estimates', () => {
        const phase = new EstimatePhase([p1, p2]);
        phase.initForRound(1);
        expect(() => {
            phase.estimate(p1, 1);
            phase.estimate(p1, 1);
        }).to.throw(PlayerHasAlreadyEstimatedError); 
        phase.initForRound(5);
        expect(() => {
            phase.estimate(p1, 6)
        }).to.throw(EstimateOutsideRangeError);
        expect(() => {
            phase.estimate(p1, -1)
        }).to.throw(EstimateOutsideRangeError);
    })

    it('should provide an finished observer', (done) => {
        const phase = new EstimatePhase([p1, p2]);
        const s = phase.finishedForCurrentRound$.subscribe( (_: any) => {
            s.unsubscribe();
            done();
        })

        phase.initForRound(1);
        phase.estimate(p1, 1);
        phase.estimate(p2, 0);

    })

});