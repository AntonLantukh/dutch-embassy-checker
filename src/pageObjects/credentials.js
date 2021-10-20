import {CONFIRM_VALUE} from '../constants/puppereer';
import Base from './base';

export default class Credentaials extends Base {
    constructor(page, bot) {
        super(page, bot);
    }

    credentials() {
        return 'table[id="Maintable"]';
    }

    title(row) {
        return `select[id="plhMain_repAppVisaDetails_cboTitle_${row}"]`;
    }

    name(row) {
        return `input[id="plhMain_repAppVisaDetails_tbxFName_${row}"]`;
    }

    surname(row) {
        return `input[id="plhMain_repAppVisaDetails_tbxLName_${row}"]`;
    }

    phone(row) {
        return `input[id="plhMain_repAppVisaDetails_tbxContactNumber_${row}"]`;
    }

    email(row) {
        return `input[id="plhMain_repAppVisaDetails_tbxEmailAddress_${row}"]`;
    }

    confirmation() {
        return 'select[id="plhMain_cboConfirmation"]';
    }

    submitButton() {
        return 'input[id="plhMain_btnSubmit"]';
    }

    async waitForCredentialsPage() {
        await this.waitForPage(
            this.page,
            this.bot,
            this.credentials(),
            'Could not load credentials page 😯',
        );
    }

    async insertApplicantsData(data) {
        for (let idx = 0; idx < data.length; idx++) {
            const {title, name, surname, phone, email} = data[idx];

            await this.page.select(this.title(idx), title);
            await this.page.type(this.name(idx), name);
            await this.page.type(this.surname(idx), surname);
            await this.page.type(this.phone(idx), phone);
            await this.page.type(this.email(idx), email);
        }

        await this.page.select(this.confirmation(), CONFIRM_VALUE);
    }

    async submitCredentials() {
        await this.page.click(this.submitButton());
    }
}
