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
        text?: string;
        template_id?: string;
        dynamic_template_data?: any;
}

export enum MailProvider {
        SENDGRID = 'sendgrid',
        MAILGUN = 'mailgun',
}
