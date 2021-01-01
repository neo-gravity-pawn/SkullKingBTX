import 'mocha';
import { expect } from 'chai';
import { Player } from '@core/player';
import { ScoreBoard, IPlayerScoreEntry } from '@core/scoreBoard';
import { PlayerNotRegisteredError, RoundOutsideRangeError } from '@core/error';

const p1 = new Player('Bob');
const p2 = new Player('Lisa');
const p3 = new Player('Frank');
describe('ScoreBoard', () => {
    it('should check if round is valid', () => {
        const sb = new ScoreBoard([p1, p2]);
        expect(() => {
            sb.setEstimate(p1,1)
        }).to.throw(RoundOutsideRangeError);
    })
    it('should check if player is valid', () => {
        const sb = new ScoreBoard([p1, p2]);
        sb.setRound(1);
        expect(() => {
            sb.setEstimate(p3,1)
        }).to.throw(PlayerNotRegisteredError);
        expect(() => {
            sb.setEstimate(p1,1);
        }).not.to.throw();
    })
    it('should provide option to set / get estimates for given round', () => {
        const sb = new ScoreBoard([p1, p2]);
        sb.setRound(1);
        expect(sb.getRound()).to.equal(1);
        sb.setEstimate(p1, 1);
        sb.setEstimate(p2, 0);
        sb.setRound(3);
        expect(sb.getRound()).to.equal(3);
        sb.setEstimate(p1, 2);
        sb.setEstimate(p2, 2);
        let entry: IPlayerScoreEntry;
        expect(() => {
            entry = sb.getEntry(p1, 0);
        }).to.throw(RoundOutsideRangeError);
        expect(() => {
            entry = sb.getEntry(p1, 11);
        }).to.throw(RoundOutsideRangeError);
        entry = sb.getEntry(p1, 1);
        expect(entry.estimate).to.equal(1);
        entry = sb.getEntry(p2, 1);
        expect(entry.estimate).to.equal(0);
        entry = sb.getEntry(p1, 3);
        expect(entry.estimate).to.equal(2);
        entry = sb.getEntry(p2, 3);
        expect(entry.estimate).to.equal(2);
    });
    it('should correctly calculate points', () => {
        let entry: IPlayerScoreEntry;
        const sb = new ScoreBoard([p1, p2]);
        sb.setRound(1);
        sb.setEstimate(p1, 1);
        sb.setEstimate(p2, 1);
        sb.enterTrick(p1, 0); // p1 20, p2 -10
        sb.finishRound();
        sb.setRound(2);
        sb.setEstimate(p1, 2);
        sb.setEstimate(p2, 1);
        sb.enterTrick(p1, 0);
        sb.enterTrick(p2, 50); // p1 -10, p2 70
        sb.finishRound();
        sb.setRound(3);
        sb.setEstimate(p1, 1);
        sb.setEstimate(p2, 0);
        sb.enterTrick(p1, 30); // p1 50, p2 30
        sb.finishRound();
        entry = sb.getEntry(p1, 1);
        expect(entry.estimate === 1 && entry.result === 1 && entry.extraPoints === 0 && entry.points === 20 && entry.accumulatedPoints === 20).to.be.true;
        entry = sb.getEntry(p2, 1);
        expect(entry.estimate === 1 && entry.result === 0 && entry.extraPoints === 0 && entry.points === -10 && entry.accumulatedPoints === -10).to.be.true;
        entry = sb.getEntry(p1, 2);
        expect(entry.estimate === 2 && entry.result === 1 && entry.extraPoints === 0 && entry.points === -10 && entry.accumulatedPoints === 10).to.be.true;
        entry = sb.getEntry(p2, 2);
        expect(entry.estimate === 1 && entry.result === 1 && entry.extraPoints === 50 && entry.points === 70 && entry.accumulatedPoints === 60).to.be.true;
        entry = sb.getEntry(p1, 3);
        expect(entry.estimate === 1 && entry.result === 1 && entry.extraPoints === 30 && entry.points === 50 && entry.accumulatedPoints === 60).to.be.true;
        entry = sb.getEntry(p2, 3);
        expect(entry.estimate === 0 && entry.result === 0 && entry.extraPoints === 0 && entry.points === 30 && entry.accumulatedPoints === 90).to.be.true;
    });
});