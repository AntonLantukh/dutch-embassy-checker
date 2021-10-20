import {logger} from '../logger';
import App from '../pageObjects/app';
import {goToDatesPage} from '../steps/dates';
import {makePo} from '../utils/launcher';

export const getDates = async (bot, data) => {
    const {app, browser} = await makePo(App, bot);

    try {
        logger.info('Started fetching dates...');

        await goToDatesPage(app, data);
        await app.dates.reportAvailableDates();
    } catch (e) {
        bot.sendMessage('Failed to get dates: 🙁');
        logger.error(e);
    } finally {
        await browser.close();
    }
};
