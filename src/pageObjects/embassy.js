export default class Embassy {
    embassy() {
        return 'select[id="plhMain_cboVAC"]';
    }

    submitButton() {
        return 'input[id="plhMain_btnSubmit"]';
    }

    async waitForEmbassyPage() {
        await waitForPage(this.page, this.bot, this.embassy(), 'Could not load embassy page 😦');
    }

    async selectEmbassy(embassyType) {
        await this.page.select(this.embassy(), embassyType);
        await this.page.click(this.submitButton());
    }
}
