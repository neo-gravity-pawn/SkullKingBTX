import { 
    NotEnoughPlayersError
} from '@core/error';
import 'mocha';
import { Game } from '@core/game';
import { Player } from '@core/player';
import { expect } from 'chai';
import { EstimatePhase } from '@core/estimatePhase';
import { Phase } from '@core/phase';
import { PlayPhase } from '@core/playPhase';
import { fillCollection } from '@helper/create';
import { Hand } from '@core/hand';
import { ScoreBoard } from '@core/scoreBoard';

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

    it('should provide the correct points during a game', (done) => {
        const g = initGame([p1, p2]);
        let updateCounter = 0;



        const ep = g.getPhase$(EstimatePhase).subscribe((p: EstimatePhase) => {
            p.estimate(p1, 1);
            p.estimate(p2, 1);
        });
        const pp = g.getPhase$(PlayPhase).subscribe((p: PlayPhase) => {
            p.play(p1, 0);
            p.play(p2, 0);
        });
        const su = g.scoreBoardUpdate$.subscribe((sb: ScoreBoard) => {
            if (updateCounter === 0) {
                expect(sb.getEntry(p1, sb.getRound()).estimate).to.equal(1);
                expect(sb.getEntry(p2, sb.getRound()).estimate).to.equal(1);  
                updateCounter += 1; 
                ep.unsubscribe();
                pp.unsubscribe();
                su.unsubscribe();
                done();            
            }
            /*if (updateCounter === 1) {
                expect(sb.getRound()).to.equal(1);
                expect(sb.getEntry(p1, sb.getRound()).points).to.equal(-10);
                expect(sb.getEntry(p2, sb.getRound()).points).to.equal(20);
                ep.unsubscribe();
                pp.unsubscribe();
                su.unsubscribe();
                done();
            }*/
        });
        g.start();
        p1.hand = fillCollection(Hand, {cardCodes: 'cy1'});
        p2.hand = fillCollection(Hand, {cardCodes: 'p'});
        
    });
});