import {SCHEDULE_TYPE} from '../constants';

export default class Schedule {
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
        await waitForPage(
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
            case SCHEDULE_TYPE.RESCHEDULE:
                link = this.rescheduleLink();
            case SCHEDULE_TYPE.CANCEL:
                link = this.cancelLink();
        }

        await this.page.click(link);
    }
}
