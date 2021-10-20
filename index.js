import dotEnv from 'dotenv';
import express from 'express';

import {getDates} from './src/commands/dates';
import {TelegramService} from './src/telegram';
import {logger} from './src/logger';

import {MOSCOW_DATA} from './src/constants';

dotEnv.config();
const app = express();

const {BOT_TOKEN, PORT, CHAT_ID, POLLING_INTERVAL} = process.env;

app.listen(PORT, async () => {
    logger.info(`Server started at port ${PORT}`);

    const bot = new TelegramService(BOT_TOKEN, CHAT_ID);
    bot.startListening();

    await getDates(bot, MOSCOW_DATA);

    setInterval(() => getDates(bot), POLLING_INTERVAL);
});
