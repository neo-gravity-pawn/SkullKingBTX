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
        const s = g.phase$.subscribe((p: Phase) => {
            expect(p instanceof EstimatePhase).to.be.true;
            expect(p.getRound()).to.equal(1);
            s.unsubscribe();
            done();
        })
        g.start();
    })

    it('if all players have estimated, the phase should switch to playing', (done) => {
        const g = initGame([p1, p2]);
        let estimatePhaseHappened = false;

        const s = g.phase$.subscribe( (p: Phase) => {
            if (p instanceof EstimatePhase) {
                estimatePhaseHappened = true;
                const ph = (p as EstimatePhase);
                ph.estimate(p1, 0);
                ph.estimate(p2, 1);
            }
            if (p instanceof PlayPhase) {
                expect(estimatePhaseHappened).to.be.true;
                s.unsubscribe();
                done();
            }

        })
        g.start();
    })
});