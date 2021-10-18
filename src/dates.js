const puppeteer = require('puppeteer');
const {TimeoutError} = require('puppeteer/Errors');
const {PageTimeoutError} = require('./errors');
const {logger} = require('./logger');

const DUTCH_EMBASSY_SITE =
    'https://www.netherlandsworldwide.nl/countries/russian-federation/travel/applying-for-a-long-stay-visa-mvv';

const SELECTORS = {
    appointmentLink: 'a[aria-label="Make an appointment (opens external website)"]',
    schduleType: 'a[id="AppointmentHyperLink"]',
    scheduleLink: 'a[id="plhMain_lnkSchApp"]',
    rescheduleLink: 'a[id="plhMain_lnkReSchApp"]',
    formEmbassy: 'select[id="plhMain_cboVAC"]',
    formSubmit: 'input[id="plhMain_btnSubmit"]',
    embassy: 'table[id="plhMain_tbl"]',
    formApplicantsNumber: 'input[id="plhMain_tbxNumOfApplicants"]',
    formVisaType: 'select[id="plhMain_cboVisaCategory"]',
    credentials: 'table[id="Maintable"]',
    formTitle: 'select[id="plhMain_repAppVisaDetails_cboTitle_0"]',
    formName: 'input[id="plhMain_repAppVisaDetails_tbxFName_0"]',
    formSurname: 'input[id="plhMain_repAppVisaDetails_tbxLName_0"]',
    formPhone: 'input[id="plhMain_repAppVisaDetails_tbxContactNumber_0"]',
    formEmail: 'input[id="plhMain_repAppVisaDetails_tbxEmailAddress_0"]',
    formConfirmation: 'select[id="plhMain_cboConfirmation"]',
    calendar: 'table[id="plhMain_cldAppointment"]',
    availableDate: '.OpenDateAllocated a',
    availableTime: 'a[id="plhMain_gvSlot_lnkTimeSlot_0"]',
};

const DATA = {
    /** Moscow */
    embassy: '72',
    /** MVV-visa */
    visaType: '8',
    /** Applicants number */
    applicantsNumber: '1',
    title: 'MR.',
    name: 'ANTON',
    surname: 'LANTUKH',
    phone: '79150543728',
    email: 'lantukhanton@gmail.com',
    /** Data confirmed */
    confirmation: '1',
};

const {WAIT_TIMEOUT} = process.env;

const waitForPage = async (page, bot, selector, error) => {
    try {
        await page.waitForSelector(selector, {timeout: WAIT_TIMEOUT});
    } catch (e) {
        if (e instanceof TimeoutError) {
            logger.error(e);
            throw new PageTimeoutError('Page Timeout');
        }
    }
};

module.exports.getDates = async bot => {
    const browser = await puppeteer.launch({headless: true, args: ['--incognito']});

    try {
        logger.info('Started fetching dates...');

        const context = await browser.createIncognitoBrowserContext();
        const page = await context.newPage();

        // Listening to the dialog
        page.once('dialog', async dialog => {
            await dialog.accept();
        });

        // Opening the page
        await page.setViewport({width: 1920, height: 1080});
        await page.goto(DUTCH_EMBASSY_SITE);

        // Waiting for page load and going to portal
        await waitForPage(page, bot, SELECTORS.appointmentLink, 'Can not load appointment info page 😭');

        await page.click(SELECTORS.appointmentLink);

        // Going to portal and selecting schedule
        await waitForPage(page, bot, SELECTORS.schduleType, 'Can not load schedule select page 😦');

        await page.click(SELECTORS.scheduleLink);

        // Going to schedule and selecting Moscow
        await waitForPage(page, bot, SELECTORS.embassy, 'Can not load embassy select page 😱');

        await page.select(SELECTORS.formEmbassy, DATA.embassy);
        await page.click(SELECTORS.formSubmit);

        // Selecting number of applicants and visa type
        await waitForPage(page, bot, SELECTORS.formVisaType, 'Can not load visa type page 😳');

        await page.select(SELECTORS.formVisaType, DATA.visaType);
        await page.$eval(SELECTORS.formApplicantsNumber, el => (el.value = ''));
        await page.type(SELECTORS.formApplicantsNumber, DATA.applicantsNumber);
        await page.click(SELECTORS.formSubmit);

        // Inserting applicant data
        await waitForPage(page, bot, SELECTORS.credentials, 'Can not load credentials page 😯');

        await page.select(SELECTORS.formTitle, DATA.title);
        await page.type(SELECTORS.formName, DATA.name);
        await page.type(SELECTORS.formSurname, DATA.surname);
        await page.type(SELECTORS.formPhone, DATA.phone);
        await page.type(SELECTORS.formEmail, DATA.email);
        await page.select(SELECTORS.formConfirmation, DATA.confirmation);
        await page.click(SELECTORS.formSubmit);

        // Searching for dates and sending them
        await waitForPage(page, bot, SELECTORS.calendar, 'Can not load calendar page');

        const dates = await page.$$eval(SELECTORS.availableDate, days =>
            (days || []).map(day => day.getAttribute('title')),
        );

        if (!dates?.length) {
            bot.sendMessage(process.env.CHAT_ID, 'No available dates 😥');
            logger.info(`Dates not found: ${new Date()}`);
            return;
        }

        bot.sendMessage(process.env.CHAT_ID, `Available dates: ${dates.join(', ').toString()}`);
        logger.info('Dates successfully sent to the bot!');

        const firstAvailableDate = dates?.[0];

        // Setting appointment if current month is available
        if ((firstAvailableDate || '').includes('October')) {
            logger.info('Wow, found great date!');

            // Selecting date
            await page.click(SELECTORS.availableDate);
            await page.waitForSelector(SELECTORS.availableTime, {timeout: WAIT_TIMEOUT});

            // Selecting time
            const time = await page.$eval(SELECTORS.availableTime, time => time.textContent);
            await page.click(SELECTORS.availableTime);
            bot.sendMessage(
                process.env.CHAT_ID,
                `Appointment scheduled at date: ${firstAvailableDate}, time: ${time} 😉`,
            );
            console.log('Appointment scheduled!');
        }
    } catch (e) {
        bot.sendMessage(process.env.CHAT_ID, 'Failed to get dates: 🙁');
    } finally {
        await browser.close();
    }
};
