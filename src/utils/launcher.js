import puppeteer from 'puppeteer';

import {DUTCH_EMBASSY_SITE} from '../constants';

export const makePo = async (App, bot) => {
    const browser = await puppeteer.launch({headless: true, args: ['--incognito']});
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    page.once('dialog', async dialog => {
        await dialog.accept();
    });

    await page.setViewport({width: 1920, height: 1080});
    await page.goto(DUTCH_EMBASSY_SITE);

    return {page, browser, app: new App(page, bot)};
};
