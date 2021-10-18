const puppeteer = require('puppeteer');
const dotEnv = require('dotenv');
const express = require('express');

const {getDates} = require('./src/dates');
const {TelegramService} = require('./src/telegram');

dotEnv.config();
const app = express();

const {BOT_TOKEN, PORT, CHAT_ID, POLLING_INTERVAL} = process.env;

const bot = new TelegramService(BOT_TOKEN, CHAT_ID);
bot.startListening();

app.listen(PORT, async () => {
    console.log(`Server started at port ${PORT}`);

    await getDates(bot);

    setInterval(() => getDates(bot), POLLING_INTERVAL);
});
