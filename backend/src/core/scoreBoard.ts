import { PlayerNotRegisteredError, RoundOutsideRangeError } from "./error";
import { Player } from "./player";
import { getPoints } from "./rules";

export interface IPlayerScores {
    player: Player,
    entries: Array<IPlayerScoreEntry>
}

export interface IPlayerScoreEntry {
    estimate: number,
    result: number,
    extraPoints: number,
    points: number,
    accumulatedPoints: number
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
                   result: -1,
                   extraPoints: 0,
                   points: 0,
                   accumulatedPoints: 0
               })
            }
        })
    }


    public setRound(round: number) {
        this.round = round;
    }

    public getRound() {
        return this.round;
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
        this.checkRound(this.round);
        entries[this.round-1].estimate = estimate;
    }

    public getEntry(player: Player, round: number) {
        const entries = this.getEntriesForPlayer(player);
        this.checkRound(round);
        return entries[round-1];
    }

    private checkRound(round: number) {
        if (round < 1 || round > this.maxNrOfRounds) {
            throw new RoundOutsideRangeError(round);
        }
    }

    public setResult(player: Player, estimatedNumberOfTrick: number, realNumberOfTricks: number, extraPoints: number) {
        const entry = this.getEntry(player, this.round);
        entry.estimate = estimatedNumberOfTrick;
        entry.result = realNumberOfTricks;
        entry.extraPoints = estimatedNumberOfTrick === realNumberOfTricks ? extraPoints : 0;
        entry.points = getPoints(estimatedNumberOfTrick, realNumberOfTricks, this.round) + entry.extraPoints;
        this.updateAccumulatedPoints(player);
    }
    
    private updateAccumulatedPoints(player: Player) {
        let sum = 0;
        const entries = this.getEntriesForPlayer(player);
        entries.forEach(entry => {
            sum += entry.points;
            entry.accumulatedPoints = sum;
        })
    }
}