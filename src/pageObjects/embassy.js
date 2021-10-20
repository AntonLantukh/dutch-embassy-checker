import Base from './base';

export default class Embassy extends Base {
    constructor(page, bot) {
        super(page, bot);
    }

    embassy() {
        return 'select[id="plhMain_cboVAC"]';
    }

    submitButton() {
        return 'input[id="plhMain_btnSubmit"]';
    }

    async waitForEmbassyPage() {
        await this.waitForPage(
            this.page,
            this.bot,
            this.embassy(),
            'Could not load embassy page 😦',
        );
    }

    async selectEmbassy(embassyType) {
        await this.page.select(this.embassy(), embassyType);
        await this.page.click(this.submitButton());
    }
}
