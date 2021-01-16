import { Subject } from "rxjs";
import { MaleformedMessageError, UnknownMessageTypeError } from "./error";


export interface IMessage {
    type: string;
}

export class GameServer {

    private messageDefinitions:{[key: string]: {format: Array<any>, handler: any}} = {
        'REGISTER_PLAYER': {
            format: [['string', 'name']], 
            handler: this.onPlayerRegistered.bind(this)
        }
    }

    private broadcastSubject = new Subject<IMessage>();
    public broadcast$ = this.broadcastSubject.asObservable();

    public onMessage(message: IMessage) {
        if (message.type in this.messageDefinitions) {
            if (this.checkMessage(message) === true) {
                this.messageDefinitions[message.type].handler(message);
            } else {
                throw new MaleformedMessageError(message.type);
            }
        } else {
            throw new UnknownMessageTypeError(message.type);
        }
    }


    private checkMessage(message: IMessage): boolean {
        let isOk = true;
        this.messageDefinitions[message.type].format.forEach( (e:Array<string>) => {
            if (!(e[1] in message) || String(typeof (message as any)[e[1]]) !== e[0]) {
                isOk = false;
            }
        })
        return isOk;
    }

    private broadcast(message: IMessage) {
        this.broadcastSubject.next(message);
    }

    private onPlayerRegistered(message: IMessage) {
        this.broadcast({type: 'peng'});
    }
}