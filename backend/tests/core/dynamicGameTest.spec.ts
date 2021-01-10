import 'mocha';
import { Player } from '@core/player';
import { Game, GameEvent, GameFinishedEvent, PhaseChangedEvent, ScoresUpdatedEvent, TrickCompleteEvent } from '@core/game';
import { EstimatePhase } from '@core/estimatePhase';
import { ScoreBoard } from '@core/scoreBoard';
import { PlayPhase } from '@core/playPhase';
import { createCardString, createCollectionString } from '@helper/output';
import { Subscription } from 'rxjs';

describe('Complete', () => {
    it('Start', (done) => {
        const players = [new Player('Anna'), new Player('Bob'), new Player('Charlie')];
        const g = new Game();
        let es: Subscription;
 
        g.addPlayer(players[0]);
        g.addPlayer(players[1]);
        g.addPlayer(players[2]);

        const runLater = (fn: any) => {
                return new Promise<void>(resolve => setTimeout(_ => {fn(); resolve();}, 0));
        }

        const printRoundResult = (sb: ScoreBoard, r: number) => {
            console.log();
            console.log(`Round ${r} Results:`)
            players.forEach(player => {
                const e = sb.getEntry(player, r);
                console.log(`    ${player.name}: ${e.result}/${e.estimate} => ${e.points}(${e.extraPoints}) => ${e.accumulatedPoints}`)
            })
        }

        const  estimate = (phase: EstimatePhase) => {
            const r = phase.getRound();
            players.forEach(async player => {
                const e = Math.round((Math.random() * r) / 2.0);
                await runLater( () => {
                    phase.estimate(player, e);
                })
            });
        }

        const play = async (phase: PlayPhase) => {
            for (let k = 0; k < phase.getRound(); k++) {
                const startIndex = players.indexOf(phase.getActivePlayer());
                for (let j = 0; j < players.length; j++) {
                    let pi = (startIndex + j) % players.length;
                    const player = players[pi];
                    await runLater( () => {
                        for (let i = 0; i < phase.getRound(); i++) {
                            try {
                                const card = player.hand.getCard(i);
                                phase.play(player, i);
                                console.log(`${player.name} plays ${createCardString(card)}`)
                                break;
                            } catch {}
                        }
                    })
                };
            }
        }

        es = g.event$.subscribe((event: GameEvent) => {
            const sb = event.scoreBoard;
            if (event instanceof ScoresUpdatedEvent) {
                //
            }
            else if (event instanceof TrickCompleteEvent) {
                console.log(`==> ${event.trickResult.winningPlayer.name} got the trick!`);
                console.log();
            }
            else if (event instanceof PhaseChangedEvent) {
                const phase = event.newPhase;
                if (phase instanceof EstimatePhase) {
                    estimate(phase);
                }
                else if (phase instanceof PlayPhase) {
                    if (phase.getRound() > 1) {
                        printRoundResult(sb, phase.getRound() - 1);
                    }
                    const r = phase.getRound();
                    console.log();
                    console.log('---------------------------------------------------------');
                    console.log(`Round: ${r}`);
                    console.log('---------------------------------------------------------');
                    console.log();
                    console.log(`Hand -> Estimate: `)
                    players.forEach(player => {
                        console.log(`    ${player.name}: ${createCollectionString(player.hand)} -> ${sb.getEntry(player, r).estimate}`)
                    });
                    console.log();
                    play(phase);
                }
            }
            else if (event instanceof GameFinishedEvent) {
                printRoundResult(sb, 10);
                console.log();
                console.log("=========================================================");
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
                done();
            }
        });
        g.start();
    })
})