export interface IMailerProvider {
        send(mail: MailParameter, retries?: number): Promise<boolean>;
}

export interface MailParameter {
        from: {
                name: string;
                email: string;
        };
        to: string;
        subject: string;
        text: string;
        templateId?: string;
        dynamicTemplateData?: any;
}

export enum MailProvider {
        SENDGRID = 'sendgrid',
        MAILGUN = 'mailgun',
}
