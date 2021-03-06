import { expect } from 'chai';
import { ITrickResult, PlayPhase, TrickFinishedEvent } from '@core/playPhase';
import 'mocha';
import { Player } from '@core/player';
import { Hand } from '@core/hand';
import { CardCannotBePlayedError, NotActivePlayerError, PhaseNotInitializedError, PlayerNotRegisteredError } from '@core/error';
import { fillCollection } from '@helper/create';
import { Phase, PhaseEvent, PhaseFinishedEvent } from '@core/phase';

const p1 = new Player('Anna');
const p2 = new Player('Bob');
const p3 = new Player('Charlie');

describe('PlayPhase', () => {
    it('should check if phase was initialized', () => {
        const phase = new PlayPhase([p1, p2]);
        expect(() => {
            phase.play(p1, 0);
        }).to.throw(PhaseNotInitializedError); 
    })

   it('should check if player is valid', () => {

        const phase = new PlayPhase([p1, p2]);
        phase.initForRound(1);
        expect(() => {
            phase.play(p3, 0);
        }).to.throw(PlayerNotRegisteredError); 

        expect(() => { 
            phase.play(p2, 0);
        }).to.throw(NotActivePlayerError);

        expect(() => { 
            phase.play(p1, 0);
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
                    phase.play(i, 0);
                }).to.throw(NotActivePlayerError);
            })    
            expect(phase.getActivePlayer()).to.equal(r.valid);
            expect(() => { 
                phase.play(r.valid, 0);
            }).to.not.throw();
        })
    })

    it ('should check, if a card can be actually played', () => {
        const phase = new PlayPhase([p1, p2]);
        phase.initForRound(1);
        p1.hand = fillCollection(Hand, {cardCodes:'cr1,e'});
        p2.hand = fillCollection(Hand, {cardCodes:'cr2,cb10'});
        phase.play(p1, 0);
        expect(() => {
            phase.play(p2, 1);
        }).to.throw(CardCannotBePlayedError);

    })

    it('should advance active player after play', () => {
        const players = [p1, p2, p3];
        const phase = new PlayPhase(players);
        phase.initForRound(1);
        for(let i = 0; i < 3; i++) {
            const p = phase.getActivePlayer();
            expect(p).to.equal(players[i]);
            phase.play(p, 0);
        }        
    })

    it('should deal cards according to round', () => {
        const phase = new PlayPhase([p1, p2]);
        phase.initForRound(1);
        expect(p1.hand.getNumberOfCards()).to.equal(1);
        expect(p2.hand.getNumberOfCards()).to.equal(1);
        phase.initForRound(7);
        expect(p1.hand.getNumberOfCards()).to.equal(7);
        expect(p2.hand.getNumberOfCards()).to.equal(7);
    })

    const runLater = (fn: any) => {
        return new Promise<void>(resolve => setTimeout(_ => {fn(); resolve();}, 0));
    }

    it ('should inform if a trick is complete, provide info and set active player', (done) => {
        
        const phase = new PlayPhase([p1, p2, p3]);
        let trickCounter = 0;
        const s = phase.event$.subscribe( (event: PhaseEvent) => {
            if (event instanceof TrickFinishedEvent) {
                const info = event.trickResult;
                trickCounter += 1;
                if (trickCounter === 1) {
                    expect(phase.getActivePlayer()).to.equal(p3);
                    expect(info.winningPlayer).to.equal(p3);
                    expect(info.extraPoints).to.equal(0);
                }
                if (trickCounter === 2) {
                    expect(phase.getActivePlayer()).to.equal(p1);
                    expect(info.winningPlayer).to.equal(p1);
                    expect(info.extraPoints).to.equal(0);
                }
                if (trickCounter === 2) {
                    s.unsubscribe();
                    done();
                }
            }
        })

        phase.initForRound(2);
        p2.hand = fillCollection(Hand, {cardCodes: 't13,cr2'});
        p3.hand = fillCollection(Hand, {cardCodes: 'cr13,e'});
        p1.hand = fillCollection(Hand, {cardCodes: 'cr6,p'});
        (async () => {
            await runLater(() => phase.play(p2, 1)); //cr2
            await runLater(() => phase.play(p3, 0)); //cr13
            await runLater(() => phase.play(p1, 0)); //cr6
            await runLater(() => phase.play(p3, 0)); //e
            await runLater(() => phase.play(p1, 0)); //p
            await runLater(() => phase.play(p2, 0)); //t13
        })();

    })
    

    it('should provide an finished observer', (done) => {
        const phase = new PlayPhase([p1, p2]);
        const s = phase.event$.subscribe( (event: PhaseEvent) => {
            if (event instanceof PhaseFinishedEvent) {
                s.unsubscribe();
                done();
            }
        })
        phase.initForRound(1);
        phase.play(p1, 0);
        phase.play(p2, 0);
    })
});