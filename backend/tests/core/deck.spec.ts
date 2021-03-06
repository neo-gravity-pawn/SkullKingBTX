import { Deck } from '@core/deck';
import { expect } from 'chai';
import 'mocha';
import { isMutableCard, MutableCard } from '@core/mutableCard';
import { CardType, CardColor } from '@core/card';
import { CardCollectionIndexOutsideRangeError } from '@core/error';

describe('Deck', () => {

    it('should contain 66 cards', () => {
        const s = new Deck();
        expect(s.getNumberOfCards()).to.be.equal(66);
    })

    it('cards should be accessible', () => {
        const s = new Deck();
        const c = s.getCard(0);
        const c2 = s.getCard(65);
    })

    it('should throw error if invalid cards are accessed', () => {
        const s = new Deck();
        expect(() => {
            const c = s.getCard(-1);
        }).to.throw(CardCollectionIndexOutsideRangeError);
        expect(() => {
            const c = s.getCard(66);
        }).to.throw(CardCollectionIndexOutsideRangeError);
    })

    it('should contain 65 standard cards and one mutable scarymary card', () => {
        const s = new Deck();
        let n = 0;
        let m = 0;
        for (let i = 0; i < s.getNumberOfCards(); i++) {
            const c = s.getCard(i);
            if (isMutableCard(c)) {
                m++
                expect((c as MutableCard).mutableType).to.equal(CardType.scarymary);
            } else {
                n++
            }
        }
        expect(m).to.equal(1);
        expect(n).to.equal(65);
    })

    it('scary mary should be either pirate (0) or escape (1)', () => {
        const s = new Deck();
        for (let i = 0; i < s.getNumberOfCards(); i++) {
            const c = s.getCard(i);
            if (isMutableCard(c)) {
                const sm = c as MutableCard;
                sm.selectCard(0);
                expect(sm.type).to.equal(CardType.pirate);
                sm.selectCard(1);
                expect(sm.type).to.equal(CardType.escape);
                break;
            }
        }
    })

    it('should contain 52 color cards, 5 escapes, 5 pirates, 2 mermaids, 1 scull king, 1 scary mary', () => {
        const s = new Deck();
        let co = 0;
        let p = 0;
        let e = 0;
        let m = 0;
        let sk = 0;
        let sm = 0;
        for (let i = 0; i < s.getNumberOfCards(); i++) {
            const c = s.getCard(i);
            if (isMutableCard(c)) {
                if ((c as MutableCard).mutableType === CardType.scarymary) {
                    sm++;
                }
            } else {
                if (c.type === CardType.color || c.type === CardType.trump ) { 
                    co++;
                }
                if (c.type === CardType.escape) { 
                    e++;
                }
                if (c.type === CardType.pirate) { 
                    p++;
                }
                if (c.type === CardType.mermaid) { 
                    m++;
                }
                if (c.type === CardType.skullking) { 
                    sk++;
                }
            }
        }
        expect(co).to.equal(52);
        expect(p).to.equal(5);
        expect(e).to.equal(5);
        expect(m).to.equal(2);
        expect(sm).to.equal(1);
        expect(sk).to.equal(1);
    })
    it('color card values should be all values between 1 and 13', () => {
        const sum = 91 * 4;
        let sv = 0;
        const s = new Deck();
        for (let i = 0; i < s.getNumberOfCards(); i++) {
            const c = s.getCard(i);
            if (c.type === CardType.color || c.type === CardType.trump) {
                sv += c.value;
                expect(c.value).within(1, 13);
            }
        }
        expect(sv).to.equal(sum);
    })
    it('Trump colors should be black and their values should sum to 91', () => {
        const s = new Deck();
        let sv = 0;
        for (let i = 0; i < s.getNumberOfCards(); i++) {
            const c = s.getCard(i);
            if (c.type === CardType.trump) {
                sv += c.value;
                expect(c.value).within(1, 13);
                expect(c.color).to.be.equal(CardColor.black);
            }
        }
        expect(sv).to.equal(91);
    })

    it('should be possible to shuffle deck', () => {
        const s = new Deck();
        const c1 = s.getCard(10);
        const c2 = s.getCard(20);
        const c3 = s.getCard(30);
        const c4 = s.getCard(40);
        s.shuffle();
        expect(
            s.getCard(10) === c1 &&
            s.getCard(20) === c2 &&
            s.getCard(30) === c3 &&
            s.getCard(40) === c4
        ).to.be.false;
    })
    it('should be possible to remove cards from deck', () => {
        const s = new Deck();
        const c1 = s.removeCard(10);
        const c2 = s.removeCard(20);
        const c3 = s.removeCard(30);
        expect(s.getNumberOfCards()).to.equal(63);
    })
})