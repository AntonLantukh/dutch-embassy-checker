import {EMBASSY} from './embassy';
import {SCHEDULE_TYPE} from './schedule';
import {MOSCOW_VISA_TYPE_VALUE, SAINT_PETERSBURG_VISA_TYPE_VALUE} from './visa';

export const APPLICANT = {
    title: 'MR.',
    name: 'ANTON',
    surname: 'LANTUKH',
    phone: '79150543728',
    email: 'lantukhanton@gmail.com',
};

export const BASE_DATA = {
    schedule: SCHEDULE_TYPE.SCHEDULE,
    embassy: EMBASSY.MOSCOW,
    visaType: MOSCOW_VISA_TYPE_VALUE.MVV_VISA,
    applicantsNumber: '1',
    applicants: [APPLICANT],
};

export const MOSCOW_DATA = {
    ...BASE_DATA,
    embassy: EMBASSY.MOSCOW,
    visaType: MOSCOW_VISA_TYPE_VALUE.MVV_VISA,
};

export const SAINT_PETERSBURG_DATA = {
    ...BASE_DATA,
    embassy: EMBASSY.SAINT_PETERSBURG,
    visaType: SAINT_PETERSBURG_VISA_TYPE_VALUE.MVV_EMPLOYMENT,
};
