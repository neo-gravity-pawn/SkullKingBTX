import 'mocha';
import { Game } from '@core/game';
import { Player } from '@core/player';
import { expect } from 'chai';

describe('Game', () => {
    it('should have players', () => {
        const g = new Game();
        g.addPlayer(new Player('Bob'));
        expect(g.numberOfPlayers).to.equal(1);
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
        const g = new Game();
        const p1 = new Player('Bob');
        const p2 = new Player('Anna');
        g.addPlayer(p1);
        g.addPlayer(p2);
        const counter = {
            [p1.name] : 0,
            [p2.name]: 0
        };
        for (let i = 0; i < 10; i++) {
            g.start();
            counter[g.activePlayer.name]++;
        }
        expect(counter[p1.name] > 0 && counter[p2.name] && counter[p1.name] + counter[p2.name] === 10).to.be.true;
    })

});