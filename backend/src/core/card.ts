export enum CardType {
    escape = 'ESCAPE',
    color = 'COLOR',
    trump = 'TRUMP',
    mermaid = 'MERMAID',
    pirate = 'PIRATE',
    skullking = 'SKULLKING'
}

export enum CardColor {
    yellow,
    red,
    blue,
    black,
    none
}

export interface ICardConfigurationInput {
    type: CardType;
    value?: number;
    color?: CardColor;
}

interface ICardConfiguration {
    type: CardType;
    value: number;
    color: CardColor; 
}

export class Card {
    protected configuration: ICardConfiguration = {
        type: CardType.escape,
        value: -1,
        color: CardColor.none
    };
    private rangeMap = [
        {
            types: [CardType.escape, CardType.mermaid, CardType.pirate, CardType.skullking], 
            range: [-1, -1]
        },
        {
            types: [CardType.color, CardType.trump], 
            range: [1, 13]
        }
    ]
    constructor(configuration?: ICardConfigurationInput) {
         this.configuration = {...this.configuration, ...configuration};
         this.checkValue();
         this.checkColor();
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

    private checkColor() {
        if (this.configuration.type === CardType.color) {
            const c = this.configuration.color;
            if (c === CardColor.black || c === CardColor.none) {
                throw Error('Color does not fit to standard color card');
            }
        }
        else if (this.configuration.type === CardType.trump) {
            this.configuration.color = CardColor.black;
        } else {
            this.configuration.color = CardColor.none;
        }
    }
    get type(): CardType {
        return this.configuration.type;
    }
    get value(): number {
        return this.configuration.value;
    }
    get color(): CardColor {
        return this.configuration.color;
    }
    get conf(): ICardConfiguration {
        return this.configuration;
    }
}
