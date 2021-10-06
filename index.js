const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');
const dotEnv = require('dotenv');
const express = require('express');

const {getDates} = require('./src/dates');

dotEnv.config();
const app = express();

const {BOT_TOKEN, PORT, CHAT_ID, POLLING_INTERVAL} = process.env;

const bot = new TelegramBot(BOT_TOKEN, {polling: true});

app.listen(PORT, async () => {
    console.log(`Server started at port ${PORT}`);

    bot.onText(/\/getdates/, async () => {
        await getDates(bot);
    });

    bot.onText(/\/getmood/, () => {
        bot.sendMessage(CHAT_ID, 'Oh, I am fine, thank you! 😄');
    });

    bot.on('polling_error', console.log);

    await getDates(bot);

    setInterval(() => getDates(bot), POLLING_INTERVAL);
});
