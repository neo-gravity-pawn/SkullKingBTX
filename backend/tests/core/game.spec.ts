import { 
    NotActivePlayerError,
    NotEnoughPlayersError,
    PlayerNotRegisteredError,
    EstimateOutsideRangeError,
    PlayerHasAlreadyEstimatedError
} from '@core/error';
import 'mocha';
import { Game, GamePhase, IPhaseInfo } from '@core/game';
import { Player } from '@core/player';
import { expect } from 'chai';
import { EstimatePhase } from '@core/estimatePhase';

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
        //expect(g.registeredPlayers).to.eql([p1, p2]);
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
        const s = g.phase$.subscribe((i: IPhaseInfo) => {
            expect(i.phase instanceof EstimatePhase).to.be.true;
            expect(i.phaseType).to.equal(GamePhase.estimate);
            expect(i.phase.getRound()).to.equal(1);
            s.unsubscribe();
            done();
        })
        g.start();
    })

    it('if all players have estimated, the phase should switch to playing', (done) => {
        const g = initGame([p1, p2]);
        let estimatePhaseHappened = false;

        const s = g.phase$.subscribe( (i: IPhaseInfo) => {
            if (i.phaseType === GamePhase.estimate) {
                estimatePhaseHappened = true;
                const p = (i.phase as EstimatePhase);
                p.estimate(p1, 0);
                p.estimate(p2, 1);
                console.log("CHECKED");
            }
            if (i.phaseType === GamePhase.play) {
                expect(estimatePhaseHappened).to.be.true;
                s.unsubscribe();
                done();
            }

        })
        g.start();
    })

    /*

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
    })

    
    it('if all players have estimated, the phase should switch to playing', (done) => {
        const g = initGame([p1, p2]);
        g.start();
        const s = g.playPhase$.subscribe( (_: any) => {
            s.unsubscribe();
            done();
        })
        g.estimate(p1, 0);
        g.estimate(p2, 1);
    })

    it('only the active player should be allowed to play valid card', (done) => {
        const g = initGame([p1, p2]);
        let naPlayer: Player;
        let aPlayer: Player;
        g.start();
        const s = g.playPhase$.subscribe( (_: any) => {
            s.unsubscribe();
            [naPlayer, aPlayer] = p1 === g.activePlayer ? [p2, p1] : [p1, p2];
            expect(() => {
                g.play(naPlayer,0);
            }).to.throw(NotActivePlayerError);
            done();
        })
        g.estimate(p1, 0);
        g.estimate(p2, 1);
    })*/

});