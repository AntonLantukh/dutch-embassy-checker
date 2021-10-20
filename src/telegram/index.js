import TelegramBot from 'node-telegram-bot-api';

import {getDates} from '../commands/dates';
import {MOSCOW_DATA, SAINT_PETERSBURG_DATA} from '../constants';

export class TelegramService {
    bot;
    token;
    chatId;

    constructor(token, chatId) {
        this.token = token;
        this.chatId = chatId;
        this.#init(token, chatId);
    }

    #init(token) {
        this.bot = new TelegramBot(token, {polling: true});
    }

    startListening() {
        this.bot.onText(/\/get_moscow_dates/, async () => {
            await getDates(this.bot, MOSCOW_DATA);
        });

        this.bot.onText(/\/get_saint-petersburg_dates/, async () => {
            await getDates(this.bot, SAINT_PETERSBURG_DATA);
        });

        this.bot.onText(/\/get_mood/, () => {
            this.bot.sendMessage(this.chatId, 'Oh, I am fine, thank you! 😄');
        });

        this.bot.on('polling_error', console.log);
    }

    sendMessage(...args) {
        this.bot.sendMessage(this.chatId, ...args);
    }
}
