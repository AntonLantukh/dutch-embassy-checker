import Base from './base';
import Credentials from './credentials';
import Dates from './dates';
import Embassy from './embassy';
import Schedule from './schedule';
import Time from './time';
import Visa from './visa';

class App extends Base {
    constructor(page, bot) {
        super(page, bot);

        this.credentials = new Credentials(page, bot);
        this.embassy = new Embassy(page, bot);
        this.dates = new Dates(page, bot);
        this.time = new Time(page, bot);
        this.schedule = new Schedule(page, bot);
        this.visa = new Visa(page, bot);
    }

    appointmentLink() {
        return 'a[aria-label="Make an appointment (opens external website)"]';
    }

    async waitForAppointmentPage() {
        await this.waitForPage(
            this.page,
            this.bot,
            this.appointmentLink(),
            'Could not load appointment info page 😭',
        );
    }

    async goToPortal() {
        await this.page.click(this.appointmentLink());
    }
}

export default App;
