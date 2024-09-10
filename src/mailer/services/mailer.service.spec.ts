import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { SendgridProvider } from '../providers/sendgrid.provider';
import { MailgunProvider } from '../providers/mailgun.provider';
import { ConfigService } from '@nestjs/config';
import { MailProvider, MailParameter } from '../@types/interfaces';

describe('MailerService', () => {
    let service: MailerService;
    let sendgridProvider: SendgridProvider;
    let mailgunProvider: MailgunProvider;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MailerService,
                SendgridProvider,
                MailgunProvider,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<MailerService>(MailerService);
        sendgridProvider = module.get<SendgridProvider>(SendgridProvider);
        mailgunProvider = module.get<MailgunProvider>(MailgunProvider);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getMailProvider', () => {
        it('should return SendgridProvider when provider is SENDGRID', () => {
            expect(service['getMailProvider'](MailProvider.SENDGRID)).toBe(sendgridProvider);
        });

        it('should return MailgunProvider when provider is MAILGUN', () => {
            expect(service['getMailProvider'](MailProvider.MAILGUN)).toBe(mailgunProvider);
        });

        it('should throw an error if an unsupported provider is used', () => {
            expect(() => service['getMailProvider']('unsupported')).toThrow(
                '[Unsupported]: Mail provider: unsupported not supported'
            );
        });
    });

    describe('send', () => {
        it('should send an email using SendgridProvider when configured', async () => {
            jest.spyOn(configService, 'get').mockImplementation((key: string) => {
                switch (key) {
                    case 'mailer.provider':
                        return MailProvider.SENDGRID;
                    case 'mailer.sender':
                        return { email: 'test@example.com', name: 'Test Sender' };
                    default:
                        return null;
                }
            });

            const sendSpy = jest.spyOn(sendgridProvider, 'send').mockResolvedValue(true);
            const mailParams: MailParameter = {
                from: { email: 'recipient@example.com', name: 'Recipient' },
                to: 'test@example.com',
                subject: 'Test Email',
                text: 'This is a test email',
            };

            const result = await service.send(mailParams);

            expect(sendSpy).toHaveBeenCalledWith({
                from: {email: 'recipient@example.com', name: 'Recipient' },
                ...mailParams,
            });
            expect(result).toBe(true);
        });

        it('should send an email using MailgunProvider when configured', async () => {
            jest.spyOn(configService, 'get').mockImplementation((key: string) => {
                switch (key) {
                    case 'mailer.provider':
                        return MailProvider.MAILGUN;
                    case 'mailer.sender':
                        return { email: 'test@example.com', name: 'Test Sender' };
                    default:
                        return null;
                }
            });

            const sendSpy = jest.spyOn(mailgunProvider, 'send').mockResolvedValue(true);
            const mailParams: MailParameter = {
                from: { email: 'test@example.com', name: 'Test Sender' },
                to: 'recipient@example.com',
                subject: 'Test Email',
                text: 'This is a test email',
            };

            const result = await service.send(mailParams);

            expect(sendSpy).toHaveBeenCalledWith({
                from: { email: 'test@example.com', name: 'Test Sender' },
                ...mailParams,
            });
            expect(result).toBe(true);
        });

        it('should default to SendgridProvider if no provider is configured', async () => {
            jest.spyOn(configService, 'get').mockImplementation((key: string) => {
                switch (key) {
                    case 'mailer.provider':
                        return undefined; 
                    case 'mailer.sender':
                        return { email: 'test@example.com', name: 'Test Sender' };
                    default:
                        return null;
                }
            });

            const sendSpy = jest.spyOn(sendgridProvider, 'send').mockResolvedValue(true);
            const mailParams: MailParameter = {
               from: { email: 'test@example.com', name: 'Test Sender' },
                to: 'recipient@example.com',
                subject: 'Test Email',
                text: 'This is a test email',
            };

            const result = await service.send(mailParams);

            expect(sendSpy).toHaveBeenCalledWith({
                from: { email: 'test@example.com', name: 'Test Sender' },
                ...mailParams,
            });
            expect(result).toBe(true);
        });
    });
});