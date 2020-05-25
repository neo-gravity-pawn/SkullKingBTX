import { MutableCard } from './../core/mutableCard';
import { CardType, CardColor, Card } from '@core/card';
export function cc(cardCode: string): Card {

    if (cardCode.length === 0) {
        throw('No card code supplied to cc function.');
    }

    const typeMap: { [code: string]: any} = {
        'c': CardType.color,
        't': CardType.trump,
        's': CardType.skullking,
        'p': CardType.pirate,
        'm': CardType.mermaid,
        'e': CardType.escape,
        'x': CardType.scarymary
    }

    const colorMap: { [code: string]: any} = {
        'r': CardColor.red,
        'b': CardColor.blue,
        'y': CardColor.yellow
    }

    const type = typeMap[cardCode[0]];
    let color = CardColor.none;
    let value = -1;
    if (type === CardType.scarymary) {
        return new MutableCard(type, [cc('p'), cc('e')]);
    } else {
        if (type === CardType.trump) {
            color = CardColor.black;
            value = Number(cardCode.substr(1));
        } else {
            if (cardCode.length >= 2) {
                color = colorMap[cardCode[1]];
            }
        
            if (cardCode.length > 2) {
                value = Number(cardCode.substring(2));
            }
        }
        return new Card({type, color, value});
    }
}