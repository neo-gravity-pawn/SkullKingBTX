import { isMutableCard, MutableCard } from '@core/mutableCard';
import { CardCollection } from '@core/cardCollection';
import { Card, CardColor, CardType } from "@core/card";

export function createCardString(card: Card): string {
    const stringMap = {
        [CardColor.red]: 'r',
        [CardColor.blue]: 'b',
        [CardColor.yellow]: 'y',
        [CardColor.black]: 'b',
        [CardColor.none]: '-',
        [CardType.color]: 'c',
        [CardType.trump]: 't',
        [CardType.pirate]: 'p',
        [CardType.scarymary]: 'sm',
        [CardType.trump]: 't',
        [CardType.mermaid]: 'm',
        [CardType.skullking]: 'sk',
        [CardType.escape]: 'e'
    }
    let t: string;
    let rs = '';
    if (card.type === CardType.color) {
        rs += `${stringMap[card.color]}${card.value}`;
    } else {
        rs += stringMap[isMutableCard(card) ? (card as MutableCard).mutableType : card.type]
        if (rs === stringMap[CardType.scarymary]) {
            rs += `(${stringMap[card.type]})`
        }
        if (card.type === CardType.trump) {
            rs += `${card.value}`;
        }
    }
    return rs;
}

export function createCollectionString(collection: CardCollection): string {
    const nrOfCards = collection.getNumberOfCards();
    let rs =`(${nrOfCards}): `;
    for (let i = 0; i < nrOfCards; i++) {
        rs += `${createCardString(collection.getCard(i))}, `;
    }
    return rs.substr(0, rs.length - 2);
}