import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MessengerService } from './messenger.service';
import { TwilioProvider } from '../providers/twilio.provider';
import { MessengerProvider, SMSParameter } from '../@types/interfaces';

describe('MessengerService', () => {
    let service: MessengerService;
    let configService: ConfigService;
    let twilioProvider: TwilioProvider;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MessengerService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            if (key === 'messenger.provider') {
                                return MessengerProvider.TWIILIO;
                            }
                            if (key === 'messenger.sender') {
                                return '+1234567890';
                            }
                            return null;
                        }),
                    },
                },
                {
                    provide: TwilioProvider,
                    useValue: {
                        send: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<MessengerService>(MessengerService);
        configService = module.get<ConfigService>(ConfigService);
        twilioProvider = module.get<TwilioProvider>(TwilioProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getMessengerProvider', () => {
        it('should return the Twilio provider when MessengerProvider.TWIILIO is configured', () => {
            const provider = service['getMessengerProvider'](
                MessengerProvider.TWIILIO,
            );
            expect(provider).toBe(twilioProvider);
        });

        it('should throw an error for unsupported providers', () => {
            expect(() =>
                service['getMessengerProvider']('UNKNOWN_PROVIDER'),
            ).toThrow(
                '[Unsupported]: Messenger provider: UNKNOWN_PROVIDER not supported',
            );
        });
    });

    describe('send', () => {
        it('should call TwilioProvider.send with the correct parameters', async () => {
            const payload: SMSParameter = {
                from:'+19876543211',
                to: '+19876543210',
                body: 'Your OTP code is 123456',
            };

            const sendSpy = jest.spyOn(twilioProvider, 'send').mockResolvedValue(true);

            const result = await service.send(payload);

            expect(configService.get).toHaveBeenCalledWith('messenger.provider');
            expect(configService.get).toHaveBeenCalledWith('messenger.sender');
            expect(sendSpy).toHaveBeenCalledWith(
                {
                    from: '+1234567890',
                    ...payload,
                },
                0,
            );
            expect(result).toBe(true);
        });

        it('should handle errors thrown by the TwilioProvider', async () => {
            const payload: SMSParameter = {
                from:'+19876543211',
                to: '+19876543210',
                body: 'Your OTP code is 123456',
            };


            jest.spyOn(twilioProvider, 'send').mockRejectedValue(new Error('Failed to send message'));

            try {
                await service.send(payload);
            } catch (error) {
                expect(error.message).toBe('Failed to send message');
            }
        });
    });
});