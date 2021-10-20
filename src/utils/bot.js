import {EMBASSY} from '../constants/embassy';
import {MODE_TYPE} from '../constants/mode';
import {
    MOSCOW_VISA_TYPE_TEXT,
    MOSCOW_VISA_TYPE_VALUE,
    SAINT_PETERSBURG_VISA_TYPE_TEXT,
    SAINT_PETERSBURG_VISA_TYPE_VALUE,
} from '../constants/visa';

export const buildCallbackEmbassyData = () => [
    [
        {
            text: 'Moscow',
            callback_data: JSON.stringify({
                value: EMBASSY.MOSCOW,
                mode: MODE_TYPE.EMBASSY,
            }),
        },

        {
            text: 'Saint Petersburg',
            callback_data: JSON.stringify({
                value: EMBASSY.SAINT_PETERSBURG,
                mode: MODE_TYPE.EMBASSY,
            }),
        },
    ],
];

export const buildCallbackVisaData = embassy => {
    const VALUES =
        embassy === EMBASSY.MOSCOW ? MOSCOW_VISA_TYPE_VALUE : SAINT_PETERSBURG_VISA_TYPE_VALUE;
    const TEXTS =
        embassy === EMBASSY.MOSCOW ? MOSCOW_VISA_TYPE_TEXT : SAINT_PETERSBURG_VISA_TYPE_TEXT;

    return Object.keys(VALUES).map(visa => [
        {
            text: TEXTS[visa],
            callback_data: JSON.stringify({
                value: VALUES[visa],
                mode: MODE_TYPE.VISA_TYPE,
            }),
        },
    ]);
};
