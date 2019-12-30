// THIS FILE KNOWS HOW TO MAKE ALL THE ACTION
// OBJECTS THAT WE WILL USE. ACTIONS ARE SIMPLE
// LITTLE PACKAGES THAT REPRESENT SOME EVENT
// THAT WILL BE DISPATCHED TO THE STORE, WHICH
// WILL TRIGGER THE EXECUTION OF A CORRESPONDING
// REDUCER, WHICH ADVANCES STATE

// THESE ARE ALL THE TYPE OF ACTIONS WE'LL BE CREATING
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_ERROR = 'REGISTER_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const CREATE_SECRET_SANTA_LIST_SUCCESS = 'CREATE_SECRET_SANTA_LIST_SUCCESS';
export const CREATE_SECRET_SANTA_LIST_ERROR = 'CREATE_SECRET_SANTA_LIST_ERROR';

export function registerSuccess() {
    return { type: 'REGISTER_SUCCESS' }
};
export function registerError(error) { 
    return { type: 'REGISTER_ERROR', error }
};
export function loginSuccess() {
    return { type: 'LOGIN_SUCCESS' }
};
export function loginError(error) {
    return { type: 'LOGIN_ERROR', error }
};
export function logoutSuccess() {
    return { type: 'LOGOUT_SUCCESS' }
};
export function createSecretSantaListSuccess() {
    return { type: 'CREATE_SECRET_SANTA_LIST_SUCCESS' }
};
export function createSecretSantaListError() {
    return { type: 'CREATE_SECRET_SANTA_LIST_ERROR' }
};
export function deleteSecretSantaListSuccess() {
    return { type: 'DELETE_SECRET_SANTA_LIST_SUCCESS' }
};
export function deleteSecretSantaListError() {
    return { type: 'DELETE_SECRET_SANTA_LIST_ERROR' }
};
export function saveSecretSantaListSuccess() {
    return { type: 'SAVE_SECRET_SANTA_LIST_SUCCESS' }
};
export function saveSecretSantaListError() {
    return { type: 'SAVE_SECRET_SANTA_LIST_ERROR' }
};