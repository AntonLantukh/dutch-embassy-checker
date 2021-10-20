import {logger} from '../logger';
import Base from './base';

export default class Dates extends Base {
    constructor(page, bot) {
        super(page, bot);
    }

    availableDate() {
        return '.OpenDateAllocated a';
    }

    calendar() {
        return 'table[id="plhMain_cldAppointment"]';
    }

    nextButton() {
        return 'a[title="Go to the next month"]';
    }

    async getDates() {
        const dates = [];

        while (true) {
            const newDates = await this.page.$$eval(this.availableDate(), days =>
                (days || []).map(day => day.getAttribute('title')),
            );

            dates.push(...newDates);

            const nextButton = await this.page
                .$eval(this.nextButton(), msg => msg?.textContent || null)
                .catch(() => null);

            if (!nextButton) {
                break;
            }

            await this.page.click(this.nextButton());
            await this.page
                .waitForNavigation({timeout: 10000, waitUntil: ['domcontentloaded']})
                .catch(() => {});
            await this.waitForDatesPage();
        }
        return dates;
    }

    async waitForDatesPage() {
        await this.waitForPage(
            this.page,
            this.bot,
            this.calendar(),
            'Could not load calendar page 😯',
        );
    }

    async reportAvailableDates() {
        const dates = await this.getDates();

        if (!dates?.length) {
            this.bot.sendMessage('No available dates 😥');
            logger.info(`Dates not found: ${new Date()}`);
            return;
        }

        this.bot.sendMessage(`Available dates: ${dates.join(', ').toString()}`);
        logger.info('Dates successfully sent to the bot!');

        return dates;
    }
}
