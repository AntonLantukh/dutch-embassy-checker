const TelegramBot = require('node-telegram-bot-api');

const {getDates} = require('./dates');

class TelegramService {
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
        this.bot.onText(/\/getdates/, async () => {
            await getDates(this.bot);
        });

        this.bot.onText(/\/getmood/, () => {
            this.bot.sendMessage(this.chatId, 'Oh, I am fine, thank you! 😄');
        });

        this.bot.on('polling_error', console.log);
    }

    sendMessage(...args) {
        this.bot.sendMessage(...args);
    }
}

module.exports = {TelegramService};
