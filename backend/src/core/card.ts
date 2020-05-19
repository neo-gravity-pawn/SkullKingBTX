export enum ICardType {
    escape = 'ESCAPE',
    color = 'COLOR',
    trump = 'TRUMP',
    mermaid = 'MERMAID',
    pirate = 'PIRATE',
    skullking = 'SKULLKING'
}

export enum ICardColor {
    yellow,
    red,
    blue,
    black,
    none
}

export interface ICardConfiguration {
    type: ICardType;
    value?: number;
    color?: ICardColor;
}

export class Card {
    protected configuration = {
        type: ICardType.escape,
        value: -1,
        color: ICardColor.none
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
    constructor(configuration?: ICardConfiguration) {
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
        if (this.configuration.type === ICardType.color) {
            const c = this.configuration.color;
            if (c === ICardColor.black || c === ICardColor.none) {
                throw Error('Color does not fit to standard color card');
            }
        }
        else if (this.configuration.type === ICardType.trump) {
            this.configuration.color = ICardColor.black;
        } else {
            this.configuration.color = ICardColor.none;
        }
    }
    get type(): ICardType {
        return this.configuration.type;
    }
    get value(): number {
        return this.configuration.value;
    }
    get color(): ICardColor {
        return this.configuration.color;
    }
}
