export interface IMessengerProvider {
        send(sms: SMSParameter, retries?: number): Promise<boolean>;
}

export interface SMSParameter {
        from: string;
        to: string;
        body: string;
}

export enum MessengerProvider {
        TWIILIO = 'twilio',
}
