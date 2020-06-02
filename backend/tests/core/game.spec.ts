import 'mocha';
import { Game, GamePhase } from '@core/game';
import { Player } from '@core/player';
import { expect } from 'chai';

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
        expect(g.registeredPlayers).to.eql([p1, p2]);

    })
    it('should be startable if at last two players are added', () => {
        const g = new Game();
        g.addPlayer(new Player('Bob'));
        expect(() => {
            g.start()
        }).to.throw();
        g.addPlayer(new Player('Anna'));
        expect(g.numberOfPlayers).to.equal(2);
        expect(() => {
            g.start()
        }).not.to.throw();  
    })
    it('should initially provide a random start player', () => {
        const g = initGame([p1, p2]);
        const counter = {
            [p1.name] : 0,
            [p2.name] : 0
        };
        for (let i = 0; i < 10; i++) {
            g.start();
            counter[g.activePlayer.name]++;
        }
        expect(counter[p1.name] > 0 && counter[p2.name] > 0 && counter[p1.name] + counter[p2.name] === 10).to.be.true;
    }),
    it('game should start with round 1 and melding phase', (done) => {
        const g = initGame([p1, p2]);
        const s = g.phase$.subscribe((p: GamePhase) => {
            expect(p).to.equal(GamePhase.melding);
            expect(g.currentRound).to.equal(1);
            s.unsubscribe();
            done();
        })
        g.start();
    })
    it('during melding phase players should be able to meld', () => {
        const g = initGame([p1, p2]);
        g.start();
        expect( () => {g.meld(p3, 1)}).to.throw();
        expect( () => {g.meld(p1, 2)}).to.throw();
        expect( () => {g.meld(p1, 1)}).not.to.throw();
        expect( () => {g.meld(p1, 1)}).to.throw();
        expect( () => {g.meld(p2, 0)}).not.to.throw();
        expect( g.getMelding(p1)).to.equal(1);
        expect( g.getMelding(p2)).to.equal(0);        
    })
    it('if all players have melded, the phase should switch to playing', (done) => {
        const g = initGame([p1, p2]);
        g.start();
        const s = g.phase$.subscribe((p: GamePhase) => {
            expect(p).to.equal(GamePhase.playing);
            s.unsubscribe();
            done();
        })
        g.meld(p1, 0);
        g.meld(p2, 1);
    })
});