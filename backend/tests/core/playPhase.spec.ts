import { expect } from 'chai';
import { PlayPhase } from '@core/playPhase';
import 'mocha';
import { Player } from '@core/player';
import { EstimateOutsideRangeError, NotActivePlayerError, NotEnoughPlayersError, PhaseNotInitializedError, PlayerHasAlreadyEstimatedError, PlayerNotRegisteredError, RoundOutsideRangeError } from '@core/error';

const p1 = new Player('Bob');
const p2 = new Player('Lisa');
const p3 = new Player('Heinz');

describe('playPhase', () => {
    it('should check if phase was initialized', () => {
        const phase = new PlayPhase([p1, p2]);
        expect(() => {
            phase.play(p1, 1);
        }).to.throw(PhaseNotInitializedError); 
    })

   it('should check if player is valid', () => {

        const phase = new PlayPhase([p1, p2]);
        phase.initForRound(1);
        expect(() => {
            phase.play(p3, 1);
        }).to.throw(PlayerNotRegisteredError); 

        expect(() => { 
            phase.play(p2, 1);
        }).to.throw(NotActivePlayerError);

        expect(() => { 
            phase.play(p1, 1);
        }).to.not.throw();
    })

    it('should switch initial active player depending on round', () => {

        const phase = new PlayPhase([p1, p2, p3]);
        const roundPlayerMap = [
            {round: 1, valid: p1, invalid: [p2, p3]},
            {round: 2, valid: p2, invalid: [p1, p3]},
            {round: 3, valid: p3, invalid: [p1, p2]},
            {round: 4, valid: p1, invalid: [p2, p3]}
        ]
        roundPlayerMap.forEach(r => {
            phase.initForRound(r.round);
            r.invalid.forEach(i => {
                expect(() => { 
                    phase.play(i, 1);
                }).to.throw(NotActivePlayerError);
            })    
            expect(() => { 
                phase.play(r.valid, 1);
            }).to.not.throw();
        })

    })

    it('should provide players with cards according to round', () => {
        const phase = new PlayPhase([p1, p2]);
        phase.initForRound(1);
        expect(p1.hand.getNumberOfCards()).to.equal(1);
        expect(p2.hand.getNumberOfCards()).to.equal(1);
        phase.initForRound(7);
        expect(p1.hand.getNumberOfCards()).to.equal(7);
        expect(p2.hand.getNumberOfCards()).to.equal(7);


    })
    /*

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

    })*/

});