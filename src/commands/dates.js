import {logger} from '../logger';
import App from '../pageObjects/app';
import {makePo} from '../utils/launcher';

export const getDates = async (bot, data) => {
    const {app, browser} = await makePo(App);

    try {
        logger.info('Started fetching dates...');

        // Waiting for page load and going to portal
        await app.waitForAppointmentPage();
        await app.goToPortal();

        // Going to portal and selecting schedule
        await app.schedule.waitForSchedulePage();
        await app.schedule.selectScheduleType(data.schedule);

        // Selecting embassy
        await app.embassy.waitForEmbassyPage();
        await app.embassy.selectEmbassy(data.embassy);

        // Selecting number of applicants and visa type
        await app.visa.waitForVisaPage();
        await app.visa.setApplicantsAndVisaType(data.applicantsNumber, data.visaType);

        // Inserting applicant data
        await app.credentials.waitForCredentialsPage();
        await app.credentials.insertApplicantsData(data.applicants);
        await app.credentials.submitCredentials();

        // Searching for dates and sending them
        await app.dates.waitForDatesPage();
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
