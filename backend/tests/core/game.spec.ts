import { 
    CardCannotBePlayedError,
    NotEnoughPlayersError
} from '@core/error';
import 'mocha';
import { Game } from '@core/game';
import { Player } from '@core/player';
import { expect } from 'chai';
import { EstimatePhase } from '@core/estimatePhase';
import { PlayPhase } from '@core/playPhase';
import { fillCollection } from '@helper/create';
import { Hand } from '@core/hand';
import { ScoreBoard } from '@core/scoreBoard';
import { MutableCard } from '@core/mutableCard';

const p1 = new Player('Bob');
const p2 = new Player('Anna');
const p3 = new Player('Heinz');

function initGame(players: Array<Player>) : Game {
    const g = new Game();
    players.forEach(p => {
        g.addPlayer(p);
    })
    return g;
}

describe('Game', () => {
    it('should have players', () => {
        const g = new Game();
        g.addPlayer(p1);
        expect(g.numberOfPlayers).to.equal(1);
        g.addPlayer(p2);
        expect(g.numberOfPlayers).to.equal(2);
    })

    it('should be startable if at least two players are added', () => {
        const g = new Game();
        g.addPlayer(new Player('Bob'));
        expect(() => {
            g.start()
        }).to.throw(NotEnoughPlayersError);
        g.addPlayer(new Player('Anna'));
        expect(g.numberOfPlayers).to.equal(2);
        expect(() => {
            g.start()
        }).not.to.throw();  
    })

    it('game should start with round 1 and estimating phase', (done) => {
        const g = initGame([p1, p2]);
        let thereWasAnotherPhaseBefore = false;
        const pp = g.getPhase$(PlayPhase).subscribe((p: PlayPhase) => {
            thereWasAnotherPhaseBefore = true;
            pp.unsubscribe();
        })
        const s = g.getPhase$(EstimatePhase).subscribe((p: EstimatePhase) => {
            expect(p.getRound()).to.equal(1);
            expect(thereWasAnotherPhaseBefore).to.be.false;
            s.unsubscribe();
            done();
        })
        g.start();
    })

    it('if all players have estimated, the phase should switch to playing', (done) => {
        const g = initGame([p1, p2]);
        let estimatePhaseHappened = false;
        const ep = g.getPhase$(EstimatePhase).subscribe( (p: EstimatePhase) => {
            estimatePhaseHappened = true;
            p.estimate(p1, 0);
            p.estimate(p2, 1);
            ep.unsubscribe();
        });
        const pp = g.getPhase$(PlayPhase).subscribe( (p: PlayPhase) => {
            expect(estimatePhaseHappened).to.be.true;
            pp.unsubscribe();
            done();
        });
        g.start();
    })

    it('should provide the points during a game', (done) => {
        const g = initGame([p1, p2]);
        let updateCounter = 0;

        const ep = g.getPhase$(EstimatePhase).subscribe((p: EstimatePhase) => {
            p.estimate(p1, 1);
            p.estimate(p2, 1);
        });
        const pp = g.getPhase$(PlayPhase).subscribe((p: PlayPhase) => {
            p1.hand = fillCollection(Hand, {cardCodes: 'cy1'});
            p2.hand = fillCollection(Hand, {cardCodes: 'p'});
            p.play(p1, 0);
            p.play(p2, 0);
        });
        const su = g.scoreBoardUpdate$.subscribe((sb: ScoreBoard) => {
            if (updateCounter === 0) {
                expect(sb.getEntry(p1, sb.getRound()).estimate).to.equal(1);
                expect(sb.getEntry(p2, sb.getRound()).estimate).to.equal(1);  
                updateCounter += 1;            
            }
            else if (updateCounter === 1) {
                expect(sb.getRound()).to.equal(1);
                expect(sb.getEntry(p1, 1).points).to.equal(-10);
                expect(sb.getEntry(p2, 1).points).to.equal(20);
                ep.unsubscribe();
                pp.unsubscribe();
                su.unsubscribe();
                done();
            }
        });
        g.start();
    });

    it('play three rounds', (done) => {
        const g = initGame([p1, p2 ,p3]);
        let sb: ScoreBoard;
        g.getPhase$(EstimatePhase).subscribe((phase: EstimatePhase) => {
            if (phase.getRound() === 1) {
                phase.estimate(p1, 1);
                phase.estimate(p2, 1);
                phase.estimate(p3, 1);
            }
            if (phase.getRound() === 2) {
                expect(sb.getEntry(p1, 1).points).to.equal(-10);
                expect(sb.getEntry(p2, 1).points).to.equal(20);
                expect(sb.getEntry(p3, 1).points).to.equal(-10);
                phase.estimate(p1, 1); //0
                phase.estimate(p2, 2); //1
                phase.estimate(p3, 1); //1
            }
            if (phase.getRound() === 3) {
                expect(sb.getEntry(p1, 2).points).to.equal(-10);
                expect(sb.getEntry(p2, 2).points).to.equal(-10);
                expect(sb.getEntry(p3, 2).points).to.equal(20);
                phase.estimate(p1, 1); //1
                phase.estimate(p2, 2); //1
                phase.estimate(p3, 3); //1
            }
            if (phase.getRound() === 4) {
                expect(sb.getEntry(p1, 3).points).to.equal(20);
                expect(sb.getEntry(p2, 3).points).to.equal(-10);
                expect(sb.getEntry(p3, 3).points).to.equal(-20);
                expect(sb.getEntry(p1, 3).accumulatedPoints).to.equal(0);
                expect(sb.getEntry(p2, 3).accumulatedPoints).to.equal(0);
                expect(sb.getEntry(p3, 3).accumulatedPoints).to.equal(-10);

                done();
            }
        });
        g.getPhase$(PlayPhase).subscribe((phase: PlayPhase) => {
            if (phase.getRound() === 1) {
                p1.hand = fillCollection(Hand, {cardCodes: 'cy1'});
                p2.hand = fillCollection(Hand, {cardCodes: 'p'});
                p3.hand = fillCollection(Hand, {cardCodes: 'p'});
                phase.play(p1, 0);
                phase.play(p2, 0);
                phase.play(p3, 0);
            }
            if (phase.getRound() === 2) {
                p1.hand = fillCollection(Hand, {cardCodes: 'cr11,t4'});
                p2.hand = fillCollection(Hand, {cardCodes: 't5,cy12'});
                p3.hand = fillCollection(Hand, {cardCodes: 'm,e'});
                phase.play(p2, 1); //cy12
                phase.play(p3, 0); //m
                phase.play(p1, 0); //cr11 --> p3
                phase.play(p3, 0); //e
                phase.play(p1, 0); //t4
                phase.play(p2, 0); //t5 --> p2
            }
            if (phase.getRound() === 3) {
                p1.hand = fillCollection(Hand, {cardCodes: 't11,cb4,e'});
                p2.hand = fillCollection(Hand, {cardCodes: 'cr13,cr8,p'});
                p3.hand = fillCollection(Hand, {cardCodes: 'x,cb12,cr3'});
                phase.play(p3, 1); // cb12
                try {
                    phase.play(p1, 0); //t11
                } catch (error) {
                    if (error instanceof CardCannotBePlayedError) {
                        phase.play(p1, 1);//cb4
                    }
                }
                phase.play(p2, 2); //p --> p2
                phase.play(p2, 1); //cr8
                (p3.hand.getCard(0) as MutableCard).selectCard(0);
                phase.play(p3, 0); //x->p 
                phase.play(p1, 1); //e --> p3
                phase.play(p3, 0); //cr3
                phase.play(p1, 0); //t11
                phase.play(p2, 0); //cr13 --> p1

            }
        });
        g.scoreBoardUpdate$.subscribe((b: ScoreBoard) => sb = b);
        g.start();
    })
});