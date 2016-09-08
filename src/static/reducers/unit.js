import { createReducer } from '../utils';
import {
    UNIT_CREATE_REQUEST,
    UNIT_CREATE_FAILURE,
    UNIT_CREATE_SUCCESS,
    UNIT_LIST_REQUEST,
    UNIT_LIST_FAILURE,
    UNIT_LIST_SUCCESS
} from '../constants';
import jwtDecode from 'jwt-decode';

const initialState = {
    isCreated: false,
    unitID: null,
    isCreating: false,
    statusText: null,
    unitList: null,
    isGettingList: false,
    hasGottenList: false
};

export default createReducer(initialState, {
    [UNIT_CREATE_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            unitID: null,
            isCreating: true,
            statusText: null
        });
    },
    [UNIT_CREATE_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            unitID: payload.uuid,
            isCreating: false,
            isCreated: true,
            statusText: 'You have successfully created a unit.'
        });
    },
    [UNIT_CREATE_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            unitID: null,
            isCreating: false,
            isCreated: false,
            statusText: `Unit creation error: ${payload.statusText}`
        });
    },
    [UNIT_LIST_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            unitList: null,
            isGettingList: true,
            hasGottenList: false,
            statusText: null
        });
    },
    [UNIT_LIST_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            unitList: payload,
            isGettingList: false,
            hasGottenList: true,
            statusText: 'List of units returned'
        });
    },
    [UNIT_LIST_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            unitList: null,
            isGettingList: false,
            hasGottenList: false,
            statusText: `Unit list error: ${payload.statusText}`
        });
    }
});
