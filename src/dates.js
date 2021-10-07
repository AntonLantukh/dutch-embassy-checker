const puppeteer = require('puppeteer');

const DUTCH_EMBASSY_SITE =
    'https://www.netherlandsworldwide.nl/countries/russian-federation/travel/applying-for-a-long-stay-visa-mvv';

const SELECTORS = {
    appointmentLink: 'a[aria-label="Make an appointment (opens external website)"]',
    portalLink: 'a[id="plhMain_lnkSchApp"]',
    formEmbassy: 'select[id="plhMain_cboVAC"]',
    formSubmit: 'input[id="plhMain_btnSubmit"]',
    formApplicantsNumber: 'input[id="plhMain_tbxNumOfApplicants"]',
    formVisaType: 'select[id="plhMain_cboVisaCategory"]',
    formTitle: 'select[id="plhMain_repAppVisaDetails_cboTitle_0"]',
    formName: 'input[id="plhMain_repAppVisaDetails_tbxFName_0"]',
    formSurname: 'input[id="plhMain_repAppVisaDetails_tbxLName_0"]',
    formPhone: 'input[id="plhMain_repAppVisaDetails_tbxContactNumber_0"]',
    formEmail: 'input[id="plhMain_repAppVisaDetails_tbxEmailAddress_0"]',
    formConfirmation: 'select[id="plhMain_cboConfirmation"]',
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

module.exports.getDates = async bot => {
    try {
        console.log(`Started fetching dates...: ${new Date()}`);

        const browser = await puppeteer.launch({headless: true, args: ['--incognito']});
        const context = await browser.createIncognitoBrowserContext();
        const page = await context.newPage();

        // Listening to the dialog
        page.once('dialog', async dialog => {
            await dialog.accept();
        });

        // Opening first page
        await page.setViewport({width: 1920, height: 1080});
        await page.goto(DUTCH_EMBASSY_SITE);
        await page.waitForSelector(SELECTORS.appointmentLink, {timeout: WAIT_TIMEOUT});

        // Going to portal
        await page.click(SELECTORS.appointmentLink);
        await page.waitForSelector(SELECTORS.portalLink, {timeout: WAIT_TIMEOUT});

        // Going to schedule and selecting Moscow
        await page.click(SELECTORS.portalLink);
        await page.waitForSelector(SELECTORS.formEmbassy, {timeout: WAIT_TIMEOUT});
        await page.select(SELECTORS.formEmbassy, DATA.embassy);
        await page.click(SELECTORS.formSubmit);

        // Selecting number of applicants and visa type
        await page.waitForSelector(SELECTORS.formVisaType, {timeout: WAIT_TIMEOUT});
        await page.select(SELECTORS.formVisaType, DATA.visaType);
        await page.$eval(SELECTORS.formApplicantsNumber, el => (el.value = ''));
        await page.type(SELECTORS.formApplicantsNumber, DATA.applicantsNumber);
        await page.click(SELECTORS.formSubmit);

        // Inserting applicant data
        await page.waitForSelector(SELECTORS.formTitle, {timeout: WAIT_TIMEOUT});
        await page.select(SELECTORS.formTitle, DATA.title);
        await page.type(SELECTORS.formName, DATA.name);
        await page.type(SELECTORS.formSurname, DATA.surname);
        await page.type(SELECTORS.formPhone, DATA.phone);
        await page.type(SELECTORS.formEmail, DATA.email);
        await page.select(SELECTORS.formConfirmation, DATA.confirmation);
        await page.click(SELECTORS.formSubmit);

        // Searching for dates and sending them
        await page.waitForSelector(SELECTORS.availableDate, {timeout: WAIT_TIMEOUT});
        const titles = await page.$$eval(SELECTORS.availableDate, days => days.map(day => day.getAttribute('title')));
        bot.sendMessage(process.env.CHAT_ID, `Available dates: ${titles.join(', ').toString()}`);

        // Submitting application for current month
        await page.waitForSelector(SELECTORS.availableDate, {timeout: WAIT_TIMEOUT});
        const dates = await page.$$eval(SELECTORS.availableDate, days => days.map(day => day.getAttribute('title')));
        bot.sendMessage(process.env.CHAT_ID, `Available dates: ${dates.join(', ').toString()}`);
        console.log(`Dates successfully sent to the bot!: ${new Date()}`);

        const firstAvailableDate = dates?.[0];

        // Setting appointment if current month is available
        if ((firstAvailableDate || '').includes('October')) {
            console.log('Wow, found great date!');
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

        await browser.close();
    } catch (e) {
        console.log(e);
        bot.sendMessage(process.env.CHAT_ID, 'Failed to get dates: 🙁');
        await browser.close();
    }
};
