import {logger} from '../logger';
import App from '../pageObjects/app';
import {goToDatesPage} from '../steps/dates';
import {makePo} from '../utils/launcher';

export const setAppointment = async (bot, data) => {
    const {app, browser} = await makePo(App, bot);

    try {
        logger.info('Started setting up appointment...');

        await goToDatesPage(app, data);

        const dates = await app.dates.reportAvailableDates();
        const firstAvailableDate = dates?.[0];

        // Setting appointment if current month is available
        if ((firstAvailableDate || '').includes('October')) {
            logger.info('Wow, found great date!');

            // Selecting date and time
            await app.dates.clickFirstAvailableDate();
            await app.time.waitForTimePage();
            const time = await app.time.getFirstAvailableTimeSlot();
            await app.time.selectFirstAvaialbleTimeSlot();

            bot.sendMessage(
                `Appointment scheduled at date: ${firstAvailableDate}, time: ${time} 😉`,
            );
            logger.info('Appointment scheduled!');
        }
    } catch (e) {
        bot.sendMessage('Failed to get dates: 🙁');
        logger.error(e);
    } finally {
        await browser.close();
    }
};
