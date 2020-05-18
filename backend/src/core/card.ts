export enum ICardType {
    escape = 'ESCAPE',
    color = 'COLOR',
    trump = 'TRUMP',
    mermaid = 'MERMAID',
    pirate = 'PIRATE',
    skullking = 'SKULLKING'
}

export interface ICardConfiguration {
    type: ICardType;
    value?: number;
}

export class Card {
    private configuration = {
        type: ICardType.color,
        value: -1
    };
    private rangeMap = [
        {
            types: [ICardType.escape, ICardType.mermaid, ICardType.pirate, ICardType.skullking], 
            range: [-1, -1]
        },
        {
            types: [ICardType.color, ICardType.trump], 
            range: [1, 13]
        }
    ]
    constructor(configuration: ICardConfiguration) {
         this.configuration = {...this.configuration, ...configuration};
         this.checkValue();
    };

    private checkValue() {
        for (const info of this.rangeMap) {
            if (info.types.indexOf(this.configuration.type) !== -1) {
                const v = this.configuration.value;
                if (!v || v < info.range[0] || v > info.range[1]) {
                    throw Error(this.configuration.type +  ' card must have value within ' + info.range + ' but has ' + this.configuration.value);
                }
                break;
            }
        }
    }
    get type(): ICardType {
        return this.configuration.type;
    }
    get value(): Number {
        return this.configuration.value;
    }
}
