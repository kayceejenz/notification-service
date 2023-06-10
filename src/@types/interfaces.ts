export interface IMailerProvider {
  send(
    mail: MailParameter & { from: string },
    retries?: number,
  ): Promise<boolean>;
}

export interface IMessengerProvider {
  send(
    sms: SMSParameter & { from: string },
    retries?: number,
  ): Promise<boolean>;
}
export interface MailParameter {
  to: string;
  subject: string;
  text: string;
}

export interface SMSParameter {
  to: string;
  body: string;
}

export enum MailProvider {
  SENDGRID = 'sendgrid',
  MAILGUN = 'mailgun',
}

export enum MessengerProvider {
  TWIILIO = 'twilio',
}
