import { Subject } from "rxjs";


export interface IMessage {
    type: string;
}

export interface IRegisterPlayerMessage extends IMessage {
    playerName: string;
}

export interface IPlayersRegisteredMessage extends IMessage {
    playerNames: string[];
}

export class GameServer {

    private broadcastSubject = new Subject<IMessage>();
    public broadcast$ = this.broadcastSubject.asObservable();

    private typeToHandlerMap: {[key: string]: any}= {
        'REGISTER_PLAYER': this.onPlayerRegistered.bind(this)
    }

    public onMessage(message: IMessage) {
        if (message.type in this.typeToHandlerMap) {
            this.typeToHandlerMap[message.type](this.convertMessage(message));
        }
    }

    private convertMessage(message: IMessage) {
        let returnMessage = null;
        if (message.type === 'REGISTER_PLAYER') {
            returnMessage = (message as IRegisterPlayerMessage);
        }
        return returnMessage;
    }

    private broadcast(message: IMessage) {
        this.broadcastSubject.next(message);
    }

    private onPlayerRegistered(message: IRegisterPlayerMessage | null) {
        this.broadcast({type: 'peng'});
    }
}