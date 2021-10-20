import dotEnv from 'dotenv';
import express from 'express';

import {logger} from './src/logger';
import {TelegramService} from './src/telegram';

dotEnv.config();
const app = express();

const {BOT_TOKEN, PORT, CHAT_ID, POLLING_INTERVAL} = process.env;

app.listen(PORT, async () => {
    logger.info(`Server started at port ${PORT}`);

    const bot = new TelegramService(BOT_TOKEN, CHAT_ID, POLLING_INTERVAL);
    bot.startListening();
});
