export const goToDatesPage = async (app, data) => {
    // Waiting for page load and going to portal
    await app.waitForAppointmentPage();
    await app.goToPortal();

    // Going to portal and selecting schedule
    await app.schedule.waitForSchedulePage();
    await app.schedule.selectScheduleType(data.schedule);

    // Selecting embassy
    await app.embassy.waitForEmbassyPage();
    await app.embassy.selectEmbassy(data.embassy);

    // Selecting number of applicants and visa type
    await app.visa.waitForVisaPage();
    await app.visa.setApplicantsAndVisaType(data.applicantsNumber, data.visaType);

    // Inserting applicant data
    await app.credentials.waitForCredentialsPage();
    await app.credentials.insertApplicantsData(data.applicants);
    await app.credentials.submitCredentials();

    // Searching for dates and sending them
    await app.dates.waitForDatesPage();
};
