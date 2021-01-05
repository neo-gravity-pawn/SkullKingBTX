// missing features
// game finished hook

import 'mocha';
import { Player } from '@core/player';
import { Game } from '@core/game';
import { EstimatePhase } from '@core/estimatePhase';
import { ScoreBoard } from '@core/scoreBoard';
import { ITrickResult, PlayPhase } from '@core/playPhase';
import { createCardString, createCollectionString } from '@helper/output';
import { Subscription } from 'rxjs';

describe('Complete', () => {
    it('Start', (done) => {
        const players = [new Player('Anna'), new Player('Bob'), new Player('Charlie')];
        const g = new Game();
        let sb: ScoreBoard;
        let es: Subscription;
        let ps: Subscription;
        let ss: Subscription;
        let ts: Subscription;
        let fs: Subscription;
        let ri = 0;
        g.addPlayer(players[0]);
        g.addPlayer(players[1]);
        g.addPlayer(players[2]);
        const printRoundResult = (r: number) => {
            console.log('===================');
            console.log(`Round ${r} Results:`)
            players.forEach(player => {
                const e = sb.getEntry(player, r);
                console.log(`    ${player.name}: ${e.result}/${e.estimate} => ${e.points}(${e.extraPoints}) => ${e.accumulatedPoints}`)
            })
        }
        es = g.getPhase$(EstimatePhase).subscribe((phase: EstimatePhase) => {
            const r = phase.getRound();
            ri = 0;
            players.forEach(player => {
                const e = Math.round((Math.random() * r) / 2.0);
                phase.estimate(player, e);
            });
        });
        ps = g.getPhase$(PlayPhase).subscribe((phase: PlayPhase) => {
            const play = () => {
                const startIndex = players.indexOf(phase.getActivePlayer());
                for (let j = 0; j < players.length; j++) {
                    let pi = (startIndex + j) % players.length;
                    const player = players[pi];
                    for (let i = 0; i < phase.getRound(); i++) {
                        try {
                            const card = player.hand.getCard(i);
                            phase.play(player, i);
                            console.log(`${player.name} plays ${createCardString(card)}`)
                            break;
                        } catch {}
                    }
                };
            }

            if (typeof(ts) === 'undefined') {
                ts = phase.currentTrickComplete$.subscribe((res: ITrickResult) => {
                    console.log(`==> ${res.winningPlayer.name} got the trick!`);
                    console.log();
                    if (ri < phase.getRound()) {
                        play();
                        ri += 1;
                    }
                })
            }
            const r = phase.getRound();
            if (r > 1) {
                printRoundResult(r-1);
            }
            console.log();
            console.log('---------------------------------------------------------');
            console.log(`Round: ${r}`);
            console.log('---------------------------------------------------------');
            console.log(`Hand -> Estimate: `)
            players.forEach(player => {
                console.log(`    ${player.name}: ${createCollectionString(player.hand)} -> ${sb.getEntry(player, r).estimate}`)
            });
            console.log();
            play();

        });
        ss = g.scoreBoardUpdate$.subscribe(s => {
            sb = s;
        })

        fs = g.finished$.subscribe( () => {
            printRoundResult(10);
            console.log("SCORES:");
            let line = '\t';
            players.forEach(player => {
                line += `| ${player.name} \t\t`;
            })
            console.log(line);
            console.log('---------------------------------------------------------');
            for (let i = 0; i < 10; i++) {
                line = `${i+1} \t`;
                players.forEach(player => {
                    const e = sb.getEntry(player, i+1);
                    line += `| ${e.result}/${e.estimate}\t ${e.accumulatedPoints} \t`;
                })
                console.log(line);
            }
            es.unsubscribe();
            ps.unsubscribe();
            ss.unsubscribe();
            ts.unsubscribe();
            fs.unsubscribe();
            done();
        });
        g.start();
    })
})