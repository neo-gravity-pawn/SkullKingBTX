import 'mocha';
import { expect } from 'chai';
import { Player } from '@core/player';
import { ScoreBoard, IPlayerScores, IPlayerScoreEntry } from '@core/scoreBoard';
import { PlayerNotRegisteredError, RoundOutsideRangeError } from '@core/error';

const p1 = new Player('Bob');
const p2 = new Player('Lisa');
const p3 = new Player('Frank');
describe('ScoreBoard', () => {
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
        sb.setEstimate(p1, 1);
        sb.setEstimate(p2, 0);
        sb.setRound(3);
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
});