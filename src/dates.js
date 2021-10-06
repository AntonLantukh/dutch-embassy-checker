const puppeteer = require('puppeteer');

const DUTCH_EMBASSY_SITE =
    'https://www.netherlandsworldwide.nl/countries/russian-federation/travel/applying-for-a-long-stay-visa-mvv';

const APPOINTMENT_SELECTOR = 'a[aria-label="Make an appointment (opens external website)"]';
const PORTAL_SELECTOR = 'a[id="plhMain_lnkSchApp"]';

const SCHEDULE_SELECTOR = 'select[id="plhMain_cboVAC"]';
const SUBMIT_BUTTON = 'input[id="plhMain_btnSubmit"]';

const FORM_APPLICANTS_NUMBER = 'input[id="plhMain_tbxNumOfApplicants"]';
const FORM_VISA_TYPE = 'select[id="plhMain_cboVisaCategory"]';

const FORM_TITLE = 'select[id="plhMain_repAppVisaDetails_cboTitle_0"]';
const FORM_NAME = 'input[id="plhMain_repAppVisaDetails_tbxFName_0"]';
const FORM_SURNAME = 'input[id="plhMain_repAppVisaDetails_tbxLName_0"]';
const FORM_PHONE = 'input[id="plhMain_repAppVisaDetails_tbxContactNumber_0"]';
const FORM_EMAIL = 'input[id="plhMain_repAppVisaDetails_tbxEmailAddress_0"]';
const FORM_CONFIRMATION = 'select[id="plhMain_cboConfirmation"]';

const AVAILABLE_DATE = '.OpenDateAllocated a';

module.exports.getDates = async bot => {
    try {
        console.log(`Started fetching dates...: ${new Date()}`);

        const browser = await puppeteer.launch({headless: true});
        const context = await browser.createIncognitoBrowserContext();
        const page = await context.newPage();

        // Opening first page
        await page.setViewport({width: 1920, height: 1080});
        await page.goto(DUTCH_EMBASSY_SITE);
        await page.waitForSelector(APPOINTMENT_SELECTOR, {timeout: 10000});

        // Going to portal
        await page.click(APPOINTMENT_SELECTOR);
        await page.waitForSelector(PORTAL_SELECTOR, {timeout: 10000});

        // Going to schedule and selecting Moscow
        await page.click(PORTAL_SELECTOR);
        await page.waitForSelector(SCHEDULE_SELECTOR, {timeout: 10000});
        await page.select(SCHEDULE_SELECTOR, '72');
        await page.click(SUBMIT_BUTTON);

        // Selecting number of applicants and visa type
        await page.waitForSelector(FORM_APPLICANTS_NUMBER, {timeout: 10000});
        await page.select(FORM_VISA_TYPE, '8');
        await page.$eval(FORM_APPLICANTS_NUMBER, el => (el.value = ''));
        await page.type(FORM_APPLICANTS_NUMBER, '1');
        await page.click(SUBMIT_BUTTON);

        // Inserting applicant data
        await page.waitForSelector(FORM_TITLE, {timeout: 10000});
        await page.select(FORM_TITLE, 'MR.');
        await page.type(FORM_NAME, 'IVAN');
        await page.type(FORM_SURNAME, 'IVANOV');
        await page.type(FORM_PHONE, '79168887766');
        await page.type(FORM_EMAIL, 'abc@yandex.ru');
        await page.select(FORM_CONFIRMATION, '1');
        await page.click(SUBMIT_BUTTON);

        // Searching for dates
        await page.waitForSelector(AVAILABLE_DATE, {timeout: 10000});
        const titles = await page.$$eval(AVAILABLE_DATE, days => days.map(day => day.getAttribute('title')));
        bot.sendMessage(process.env.CHAT_ID, `Available dates: ${titles.join(', ').toString()}`);

        console.log(`Dates successfully sent to the bot!: ${new Date()}`);
    } catch (e) {
        console.log(e);
        process.exit();
    }
};
