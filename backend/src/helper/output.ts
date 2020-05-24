import { isMutableCard, MutableCard } from '@core/mutableCard';
import { CardCollection } from '@core/cardCollection';
import { Card } from "@core/card";

function createCardString(card: Card) {
    const c = card.conf;
    const t = isMutableCard(card) ? (card as MutableCard).mutableType : card.type;
    return `${t} - ${c.value} - ${c.color}`;
}
export function printCard(card: Card) { 
    console.log(createCardString(card));
}

export function printCollection(collection: CardCollection) {
    const nrOfCards = collection.getNumberOfCards();
    console.log(`Collection contains ${nrOfCards} cards`)
    for (let i = 0; i < nrOfCards; i++) {
        console.log(`${i}: ` + createCardString(collection.getCard(i)));
    }
}