import { PlayerNotRegisteredError, RoundOutsideRangeError } from "./error";
import { Player } from "./player";

export interface IPlayerScores {
    player: Player,
    entries: Array<IPlayerScoreEntry>
}

export interface IPlayerScoreEntry {
    estimate: number,
    extraPoints: number,
    currentPoints: number
}

export class ScoreBoard {
    private round = 0;
    private maxNrOfRounds = 10;
    private board = new Array<IPlayerScores>();
    constructor(private players: Array<Player>) {
        this.players.forEach(player => {
            this.board.push({
                player,
                entries: new Array<IPlayerScoreEntry>()
            })
            const entries =  this.board[this.board.length - 1].entries;
            for (let i = 0; i<this.maxNrOfRounds; i++) {
               entries.push({
                   estimate: -1,
                   extraPoints: 0,
                   currentPoints: 0
               })
            }
        })
    }


    public setRound(round: number) {
        this.round = round;
    }

    private getEntriesForPlayer(player: Player): Array<IPlayerScoreEntry> {
        const info = this.board.filter(e => e.player === player)[0];
        if (typeof(info) === 'undefined') {
            throw new PlayerNotRegisteredError(player);
        }
        return info.entries;
    }

    public setEstimate(player: Player, estimate: number) {
        const entries = this.getEntriesForPlayer(player);
        entries[this.round-1].estimate = estimate;
    }

    public getEntry(player: Player, round: number) {
        const entries = this.getEntriesForPlayer(player);
        if (round < 1 || round > this.maxNrOfRounds) {
            throw new RoundOutsideRangeError(round);
        }
        return entries[round-1];
    }
}