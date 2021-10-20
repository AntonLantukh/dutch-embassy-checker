export default class Base {
    constructor(page, bot) {
        this.page = page;
        this.bot = bot;
    }

    async waitForPage(page, bot, selector, error) {
        await waitForPage(page, bot, selector, error);
    }
}
