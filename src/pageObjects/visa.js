import {waitForPage} from '../utils/wait';

export default class Visa {
    visaType() {
        return 'select[id="plhMain_cboVisaCategory"]';
    }

    applicantsNumber() {
        return 'input[id="plhMain_tbxNumOfApplicants"]';
    }

    submitButton() {
        return 'input[id="plhMain_btnSubmit"]';
    }

    async waitForVisaPage() {
        await waitForPage(this.page, this.bot, this.visaType(), 'Could not load visa type page 😳');
    }

    async setApplicantsNumber(applicantsNumber) {
        await this.page.$eval(this.applicantsNumber(), el => (el.value = ''));
        await this.page.type(this.applicantsNumber(), applicantsNumber);
    }

    async setVisaType(type) {
        await this.page.select(this.visaType(), type);
    }

    async setApplicantsAndVisaType(applicantsNumber, type) {
        await this.setApplicantsNumber(applicantsNumber);
        await this.setVisaType(type);

        await this.page.click(this.submitButton());
    }
}
