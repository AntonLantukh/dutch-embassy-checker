import {logger} from '../logger';

export default class Dates {
    availableDate() {
        return '.OpenDateAllocated a';
    }

    calendar() {
        return 'table[id="plhMain_cldAppointment"]';
    }

    async waitForDatesPage() {
        await waitForPage(this.page, this.bot, this.calendar(), 'Could not load calendar page 😯');
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
