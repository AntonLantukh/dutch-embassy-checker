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

    async waitForDatesPage() {
        await this.waitForPage(
            this.page,
            this.bot,
            this.calendar(),
            'Could not load calendar page 😯',
        );
    }

    async reportAvailableDates() {
        const dates = await this.page.$$eval(this.availableDate, days =>
            (days || []).map(day => day.getAttribute('title')),
        );

        if (!dates?.length) {
            this.bot.sendMessage('No available dates 😥');
            logger.info(`Dates not found: ${new Date()}`);
            return;
        }

        this.bot.sendMessage(`Available dates: ${dates.join(', ').toString()}`);
        logger.info('Dates successfully sent to the bot!');

        return dates;
    }

    async clickFirstAvailableDate() {
        await this.page.click(this.availableDate());
    }
}
