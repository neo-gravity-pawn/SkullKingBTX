import { Hand } from '@core/hand';
import { MutableCard } from '@core/mutableCard';
import { expect } from 'chai';
import 'mocha';
import { CardCollection } from '@core/cardCollection';
import { canBeAddedToTrickRule, getHighestCardInTrickRule } from '@core/rules.ts';
import { cc, fillCollection } from '@helper/create';
import { Trick } from '@core/trick';
import { CardCollectionIndexOutsideRangeError } from '@core/error';

let trick: Trick;
let hand: CardCollection;

describe('Rules - canBeAddedToTrick', () => {
    it('should throw error if invalid hand card is selected', () => {
        trick = fillCollection(Trick, {playerId: 'bob'});
        hand = fillCollection(Hand);
        expect(() => {
            canBeAddedToTrickRule(hand, 1, trick);
        }).to.throw(CardCollectionIndexOutsideRangeError);
    })
    it('cards can alway be added to empty trick', () => {
        trick = fillCollection(Trick, {playerId: 'bob'});
        hand = fillCollection(Hand, {cardCodes: 'cy1,cr3,t6'});
        expect(canBeAddedToTrickRule(hand, 2, trick)).to.be.true;
    })
    it('cards can alway be added if trick is filled with non-color', () => {
        trick = fillCollection(Trick, {playerId: 'bob', cardCodes: 'p,s,m,x'});
        hand = fillCollection(Hand, {cardCodes: 'cy1,cr3,t6'});
        expect(canBeAddedToTrickRule(hand, 2, trick)).to.be.true;
    })
    it('color cards can only be added, if Farbzwang is satisfied', () => {
        trick = fillCollection(Trick, {playerId: 'bob', cardCodes:  'cr8,cy7'});
        hand = fillCollection(Hand, {cardCodes: 'cr1,cy11'});
        expect(canBeAddedToTrickRule(hand, 1, trick)).to.be.false;
        expect(canBeAddedToTrickRule(hand, 0, trick)).to.be.true;
        trick = fillCollection(Trick, {playerId: 'bob', cardCodes:  'cy7,cr8'});
        expect(canBeAddedToTrickRule(hand, 0, trick)).to.be.false;
        expect(canBeAddedToTrickRule(hand, 1, trick)).to.be.true;
        trick = fillCollection(Trick, {playerId: 'bob', cardCodes:  'e,p,cy7,p,e,cr8'});
        expect(canBeAddedToTrickRule(hand, 0, trick)).to.be.false;
        expect(canBeAddedToTrickRule(hand, 1, trick)).to.be.true;
        trick = fillCollection(Trick, {playerId: 'bob', cardCodes:  'e,t4,p,cy7,p,e,cr8'});
        expect(canBeAddedToTrickRule(hand, 0, trick)).to.be.true;
        expect(canBeAddedToTrickRule(hand, 1, trick)).to.be.true;
        hand.addCard(cc('t8'));
        expect(canBeAddedToTrickRule(hand, 0, trick)).to.be.false;
        expect(canBeAddedToTrickRule(hand, 1, trick)).to.be.false;
    })
    it('non-color cards can always be added', () => {
        hand = fillCollection(Hand, {cardCodes: 'cr1,cy1,p,m,e,x'});
        trick = fillCollection(Trick, {playerId: 'bob', cardCodes:  'e,t4,p,cy7,p,e,cr8'});
        expect(canBeAddedToTrickRule(hand, 2, trick)).to.be.true;
        expect(canBeAddedToTrickRule(hand, 3, trick)).to.be.true;
        expect(canBeAddedToTrickRule(hand, 4, trick)).to.be.true;
        expect(canBeAddedToTrickRule(hand, 5, trick)).to.be.true;
    })
})

describe('Rules - getHighestCardInTrick', () => {
    it('should provide correct index for pure color trick', () => {
        const t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'cr3,cy4,cr9,cb5'});
        expect(getHighestCardInTrickRule(t)).to.eql([2, 0]);
    })
    it('should provide correct index for trump', () => {
        let t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'cr3,t1,cr9,t6,cb5'});
        expect(getHighestCardInTrickRule(t)).to.eql([3, 0]);
        t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'cr3,t1,cr9,t6,m,cb5'});
        expect(getHighestCardInTrickRule(t)).to.eql([4, 0]);
    })
    it('should provide correct index for pirate', () => {
        let t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'cr3,t1,cr9,p,t6,cb5,p'})
        expect(getHighestCardInTrickRule(t)).to.eql([3, 0]);
        t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'cr3,s,cr9,p,t6,cb5,p'});
        expect(getHighestCardInTrickRule(t)).to.eql([1, 60]);
    })
    it('should provide correct index for mermaid', () => {
        let t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'cr3,m,t1,cr9,m,t6,cb5'})
        expect(getHighestCardInTrickRule(t)).to.eql([1, 0]);
        t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'cr3,m,t1,cr9,t6,cb5,p'});
        expect(getHighestCardInTrickRule(t)).to.eql([6, 0]);
    })
    it('should provide correct index and points for skullking', () => {
        let t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'p,cb4,s,cr9,p,cb5'});
        expect(getHighestCardInTrickRule(t)).to.eql([2, 60]);
    })
    it('should work with mermaid extra rule', () => {
        let t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'p,cb4,s,cr9,m,p,cb5,m'});
        expect(getHighestCardInTrickRule(t)).to.eql([4, 50]);
        t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'p,cb4,m,cr9,s,p,cb5,m'});
        expect(getHighestCardInTrickRule(t)).to.eql([2, 50]);
    })
    it('should provide correct index for escape', () => {
        let t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'cy4,cb3,e'});
        expect(getHighestCardInTrickRule(t)).to.eql([0, 0]);
        t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'e,e,e,e'});
        expect(getHighestCardInTrickRule(t)).to.eql([0, 0]);
        t = fillCollection(Trick, {playerId: 'bob', cardCodes:  'e,e,cy1,e'});
        expect(getHighestCardInTrickRule(t)).to.eql([2, 0]);
    })
    it('should provide correct index for scary mary', () => {
        let t = fillCollection(Trick, {playerId: 'bob', cardCodes:  't8,cb13,m'});
        const c = cc('x');
        (c as MutableCard).selectCard(1);
        t.addCard(c, 'bob');
        expect(getHighestCardInTrickRule(t)).to.eql([2, 0]);
        t = fillCollection(Trick, {playerId: 'bob', cardCodes:  't8,cb13,m'});
        (c as MutableCard).selectCard(0);
        t.addCard(c, 'bob');
        expect(getHighestCardInTrickRule(t)).to.eql([3, 0]);
        t = fillCollection(Trick, {playerId: 'bob', cardCodes:  't8,p,cb13,m'});
        (c as MutableCard).selectCard(0);
        t.addCard(c, 'bob');
        expect(getHighestCardInTrickRule(t)).to.eql([1, 0]);
    })
    it('should provide correct player id', () => {
        let t = fillCollection(Trick);
        t.addCard(cc('cr8'), 'A');
        t.addCard(cc('cr13'), 'B');
        expect(t.getPlayerIdForCard(getHighestCardInTrickRule(t)[0])).to.eql('B');
        t.addCard(cc('cy3'), 'C');
        expect(t.getPlayerIdForCard(getHighestCardInTrickRule(t)[0])).to.eql('B');
        t.addCard(cc('m'), 'D');
        expect(t.getPlayerIdForCard(getHighestCardInTrickRule(t)[0])).to.eql('D');
        t.addCard(cc('e'), 'F');
        expect(t.getPlayerIdForCard(getHighestCardInTrickRule(t)[0])).to.eql('D');
        t.addCard(cc('p'), 'G');
        expect(t.getPlayerIdForCard(getHighestCardInTrickRule(t)[0])).to.eql('G');
        t.addCard(cc('s'), 'H');
        expect(t.getPlayerIdForCard(getHighestCardInTrickRule(t)[0])).to.eql('D'); 
    })
})