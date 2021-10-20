import TelegramBot from 'node-telegram-bot-api';

import {setAppointment} from '../commands/appointment';
import {getDates} from '../commands/dates';
import {BASE_DATA, MOSCOW_DATA} from '../constants/data';
import {MODE_TYPE} from '../constants/mode';
import {logger} from '../logger';
import {buildCallbackEmbassyData, buildCallbackVisaData} from '../utils/bot';

export class TelegramService {
    constructor(token, chatId, pollingInterval) {
        this.intervalId = null;
        this.data = {};
        this.token = token;
        this.chatId = chatId;
        this.pollingInterval = pollingInterval;
        this.init(token, chatId);
    }

    init(token) {
        this.bot = new TelegramBot(token, {polling: true});
    }

    startListening() {
        this.bot.onText(/\/get_dates/, () => {
            this.sendMessage('Please select embassy location', {
                reply_markup: {
                    inline_keyboard: buildCallbackEmbassyData(),
                },
            });
        });

        this.bot.onText(/\/set_moscow_appointment/, async () => {
            await setAppointment(this, MOSCOW_DATA);
        });

        this.bot.onText(/\/start_moscow_polling/, async () => {
            if (this.intervalId) {
                this.sendMessage('Polling already launched =)');
                return;
            }

            await setAppointment(this, MOSCOW_DATA);
            this.intervalId = setInterval(() => getDates(this, MOSCOW_DATA), this.pollingInterval);
        });

        this.bot.onText(/\/stop_moscow_polling/, async () => {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.sendMessage('Polling for Moscow embassy dates stopped');
            }
        });

        this.bot.onText(/\/get_mood/, () => {
            this.sendMessage('Oh, I am fine, thank you! 😄');
        });

        this.bot.on('callback_query', async query => {
            const {
                data,
                id,
                message: {message_id},
            } = query;
            const parsedData = JSON.parse(data);

            switch (parsedData.mode) {
                case MODE_TYPE.EMBASSY:
                    this.data.embassy = parsedData.value;
                    this.bot.editMessageText('Please select visa type', {
                        message_id,
                        chat_id: this.chatId,
                        reply_markup: {
                            inline_keyboard: buildCallbackVisaData(parsedData.value),
                        },
                    });
                    break;

                case MODE_TYPE.VISA_TYPE:
                    if (!this.data.embassy) {
                        this.bot.deleteMessage(this.chatId, message_id);
                    }

                    this.data.visaType = parsedData.value;
                    await getDates(this, {...BASE_DATA, ...this.data}).then(() => {
                        this.data = {};
                        this.bot.deleteMessage(this.chatId, message_id);
                    });
                    break;
            }
            this.bot.answerCallbackQuery(id);
        });

        this.bot.on('polling_error', logger.info);
    }

    sendMessage(...args) {
        this.bot.sendMessage(this.chatId, ...args);
    }
}
