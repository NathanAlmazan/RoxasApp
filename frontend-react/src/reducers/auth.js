import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    LOGOUT
} from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: false,
    user: null,
    errorMess: null
};

export default function auth(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh,
                errorMess: null
            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                errorMess: null
            }
        case USER_LOADED_SUCCESS:
            window.sessionStorage.setItem('username', payload.username);
            window.sessionStorage.setItem('group', payload.group);
            window.sessionStorage.setItem('is_staff', payload.is_staff);
            window.sessionStorage.setItem('is_superuser', payload.is_superuser);
            return {
                ...state,
                errorMess: null,
                user: payload
            }
        case AUTHENTICATED_FAIL:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            window.sessionStorage.removeItem('username');
            window.sessionStorage.removeItem('group');
            window.sessionStorage.removeItem('is_staff');
            window.sessionStorage.removeItem('is_superuser');
            return {
                ...state,
                isAuthenticated: false,
                user: null
            }
        case USER_LOADED_FAIL:
            window.sessionStorage.removeItem('username');
            window.sessionStorage.removeItem('group');
            window.sessionStorage.removeItem('is_staff');
            window.sessionStorage.removeItem('is_superuser');
            return {
                ...state,
                errorMess: payload,
                user: null
            }
        case LOGIN_FAIL:
        case SIGNUP_FAIL:
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            window.sessionStorage.removeItem('username');
            window.sessionStorage.removeItem('group');
            window.sessionStorage.removeItem('is_staff');
            window.sessionStorage.removeItem('is_superuser');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                errorMess: payload
            }
        case PASSWORD_RESET_SUCCESS:
        case PASSWORD_RESET_FAIL:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case PASSWORD_RESET_CONFIRM_FAIL:
        case ACTIVATION_SUCCESS:
        case ACTIVATION_FAIL:
            return {
                ...state
            }
        default:
            return state
    }
};
