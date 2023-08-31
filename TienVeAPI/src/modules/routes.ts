import { Helpers } from 'src/utils';

const ROUTES = {
    AUTH: {
        MODULE: 'auth',
        LOGIN_OTP: 'login-otp',
        SAVE_ACCOUNT: 'save-account',
    },
    MESSAGE: {
        MODULE: 'message',
        CREATE: '',
        LIST: '',
    },
    USER: {
        MODULE: 'user',
        PROFILE: 'profile',
    },
    OTP: {
        MODULE: 'otp',
        CREATE: '',
    },
    BANK: {
        MODULE: 'bank',
        LIST: '',
    },
    BANK_ACCOUNT: {
        MODULE: 'bank-account',
        LIST: '',
        DETAIL: ':id',
        CREATE: '',
        UPDATE: ':id',
        DELETE: ':id',
    },
} as const;
Helpers.deepFreeze(ROUTES);

export default ROUTES;
