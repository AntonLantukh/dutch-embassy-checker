import {waitForPage as waitFor} from '../utils/wait';

export default class Base {
    constructor(page, bot) {
        this.page = page;
        this.bot = bot;
    }

    async waitForPage(page, bot, selector, error) {
        await waitFor(page, bot, selector, error);
    }
}
