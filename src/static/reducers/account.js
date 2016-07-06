import { createReducer } from '../utils';
import { ACCOUNT_CREATE_USER_REQUEST, ACCOUNT_CREATE_USER_FAILURE, ACCOUNT_CREATE_USER_SUCCESS } from '../constants';
import jwtDecode from 'jwt-decode';

const initialState = {
    isCreating: false,
    isCreated: false,
    statusText: null
};

export default createReducer(initialState, {
    [ACCOUNT_CREATE_USER_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isCreating: true,
            statusText: null
        });
    },
    [ACCOUNT_CREATE_USER_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isCreating: false,
            isCreated: true,
            statusText: null,
            statusText: 'You have created an account.'
        });
    },
    [ACCOUNT_CREATE_USER_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isCreating: false,
            isCreated: false,
            statusText: null,
            statusText: `Authentication Error: ${payload.status} ${payload.statusText}`
        });
    }
});
