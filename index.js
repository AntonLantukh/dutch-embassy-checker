const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');
const dotEnv = require('dotenv');
const express = require('express');

const {getDates} = require('./src/dates');

dotEnv.config();
const app = express();

const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);

    bot.onText(/\/getdates/, async () => {
        await getDates(bot);
    });

    bot.onText(/\/getmood/, () => {
        bot.sendMessage(process.env.CHAT_ID, 'Oh, I am fine, thank you! 😄');
    });

    bot.on('polling_error', console.log);

    setInterval(() => getDates(bot), process.env.POLLING_INTERVAL);
});
