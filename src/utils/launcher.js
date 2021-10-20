import {DUTCH_EMBASSY_SITE} from '../constants';

export const makePo = async (App, bot) => {
    const browser = await puppeteer.launch({headless: true, args: ['--incognito']});
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    // Listening to the dialog
    page.once('dialog', async dialog => {
        await dialog.accept();
    });

    // Opening the page
    await page.setViewport({width: 1920, height: 1080});
    await page.goto(DUTCH_EMBASSY_SITE);

    return {page, browser, app: new App(page, bot)};
};
