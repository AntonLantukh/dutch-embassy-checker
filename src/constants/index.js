export const EMBASSY = {
    MOSCOW: '72',

    SAINT_PETERSBURG: '112',
};

export const CONFIRM_VALUE = '1';

export const DUTCH_EMBASSY_SITE =
    'https://www.netherlandsworldwide.nl/countries/russian-federation/travel/applying-for-a-long-stay-visa-mvv';

export const SCHEDULE_TYPE = {
    SCHEDULE: 'SCHEDULE',

    RESCHEDULE: 'RESCHEDULE',

    CANCEL: 'CANCEL',
};

export const APPLICANT = {
    title: 'MR.',
    name: 'ANTON',
    surname: 'LANTUKH',
    phone: '79150543728',
    email: 'lantukhanton@gmail.com',
};

export const MOSCOW_VISA_TYPE = {
    /** Consular declarations */
    CONSULAR_DECLARATIONS: '917',

    /** ID card */
    ID_CARD: '932',

    /** MVV – visa for long stay (>90 days) */
    MVV_VISA: '8',

    /** Passport */
    PASSPORT: '925',
};

export const SAINT_PETERSBURG_VISA_TYPE = {
    /** Certificate of legal capacity to marry */
    MARY_CERTIFICATE: '902',

    /** Certificate of life (attestatie de vita) */
    LIFE_CERTIFICATE: '901',

    /** Copy conform original (NL passport, ID card or driving license) */
    CONFORM_COPY: '924',

    /** Declaration of marital status */
    MARTIAL_STATUS: '12',

    /** Declaration of residence */
    RESIDENCE_DECLARATION: '10',

    /** ID card */
    ID_CARD: '932',

    /** Legalisation of a signature */
    SIGNATURE_LEGALIZATION: '904',

    /** MVV - Exchange for study */
    MVV_EXCHANGE_STUDY: '911',

    /** MVV – Employment */
    MVV_EMPLOYMENT: '910',

    /** MVV – Family */
    MVV_FAMILY: '912',

    /** MVV – Study */
    MVV_STUDY: '913',

    /** Option request */
    OPTION_REQUEST: '13',

    /** Other requests */
    OTHER_REQUESTS: '14',

    /** Passport */
    PASSPORT: '925',
};

export const BASE_DATA = {
    schedule: SCHEDULE_TYPE.SCHEDULE,
    embassy: EMBASSY.MOSCOW,
    visaType: MOSCOW_VISA_TYPE.MVV_VISA,
    applicantsNumber: '1',
    applicants: [APPLICANT],
};

export const MOSCOW_DATA = {
    ...BASE_DATA,
    embassy: EMBASSY.MOSCOW,
    visaType: MOSCOW_VISA_TYPE.MVV_VISA,
};

export const SAINT_PETERSBURG_DATA = {
    ...BASE_DATA,
    embassy: EMBASSY.SAINT_PETERSBURG,
    visaType: SAINT_PETERSBURG_VISA_TYPE.MVV_EMPLOYMENT,
};
