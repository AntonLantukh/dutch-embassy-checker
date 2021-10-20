import {TimeoutError} from 'puppeteer/Errors';

const {WAIT_TIMEOUT} = process.env;

export class PageTimeoutError extends Error {
    constructor(...args) {
        super(...args);
    }
}

export const waitForPage = async (page, bot, selector, error) => {
    try {
        await page.waitForSelector(selector, {timeout: WAIT_TIMEOUT});
    } catch (e) {
        if (e instanceof TimeoutError) {
            logger.error(e);
            bot.sendMessage(error);
            throw new PageTimeoutError('Page Timeout');
        }
    }
};
