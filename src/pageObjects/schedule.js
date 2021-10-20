import {SCHEDULE_TYPE} from '../constants/schedule';
import Base from './base';

export default class Schedule extends Base {
    constructor(page, bot) {
        super(page, bot);
    }

    scheduleLink() {
        return 'a[id="plhMain_lnkSchApp"]';
    }

    rescheduleLink() {
        return 'a[id="plhMain_lnkReSchApp"]';
    }

    cancelLink() {
        return 'a[id="plhMain_lnkCancelApp"]';
    }

    async waitForSchedulePage() {
        await this.waitForPage(
            this.page,
            this.bot,
            this.scheduleLink(),
            'Could not load schedule select page 😦',
        );
    }

    async selectScheduleType(type) {
        let link;

        switch (type) {
            case SCHEDULE_TYPE.SCHEDULE:
                link = this.scheduleLink();
                break;
            case SCHEDULE_TYPE.RESCHEDULE:
                link = this.rescheduleLink();
                break;
            case SCHEDULE_TYPE.CANCEL:
                link = this.cancelLink();
                break;
        }

        await this.page.click(link);
    }
}
