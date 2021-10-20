import Base from './base';

export default class Time extends Base {
    constructor(page, bot) {
        super(page, bot);
    }

    availableTime(idx) {
        return `a[id="plhMain_gvSlot_lnkTimeSlot_${idx}"]`;
    }

    timeLink() {
        return 'td a';
    }

    timeList() {
        return 'table[id="plhMain_gvSlot"]';
    }

    async waitForTimePage() {
        await this.waitForPage(this.page, this.bot, this.timeList(), 'Could not load time page 😱');
    }

    async getFirstAvailableTimeSlot() {
        const time = await this.page.$eval(this.availableTime(0), time => time.textContent);

        return time;
    }

    async getAllAvailableTimeSlots() {
        const slots = await this.page.$$eval(this.timeLink, timeSlots =>
            (timeSlots || []).map(time => time.textContent),
        );

        return slots;
    }

    async selectFirstAvaialbleTimeSlot() {
        await this.page.click(this.availableTime(0));
    }
}
