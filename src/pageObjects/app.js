import Credentials from './credentials';
import Dates from './dates';
import Embassy from './embassy';
import Time from './time';
import Schedule from './schedule';

import Base from './base';

class App extends Base {
    constructor(page, bot) {
        super(page, bot);

        this.credentials = new Credentials();
        this.embassy = new Embassy();
        this.dates = new Dates();
        this.time = new Time();
        this.schedule = new Schedule();
    }

    appointmentLink() {
        return 'a[aria-label="Make an appointment (opens external website)"]';
    }

    async waitForAppointmentPage() {
        this.waitForPage(
            page,
            bot,
            this.appointmentLink(),
            'Could not load appointment info page 😭',
        );
    }

    async goToPortal() {
        await this.page.click(this.appointmentLink());
    }
}

export default App;
