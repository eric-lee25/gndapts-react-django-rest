import { createReducer } from '../utils';
import {
    BUILDING_CREATE_REQUEST,
    BUILDING_CREATE_FAILURE,
    BUILDING_CREATE_SUCCESS,
    BUILDING_LIST_REQUEST,
    BUILDING_LIST_FAILURE,
    BUILDING_LIST_SUCCESS
} from '../constants';
import jwtDecode from 'jwt-decode';

const initialState = {
    isCreated: false,
    buildingID: null,
    isCreating: false,
    isGettingList: false,
    hasGottenList: false,
    buildingList: null,
    statusText: null
};

export default createReducer(initialState, {
    [BUILDING_CREATE_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            buildingID: null,
            isCreating: true,
            isCreated: false,
            statusText: null
        });
    },
    [BUILDING_CREATE_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            buildingID: payload.uuid,
            isCreating: false,
            isCreated: true,
            statusText: 'You have successfully created a building.'
        });
    },
    [BUILDING_CREATE_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            buildingID: null,
            isCreating: false,
            isCreated: false,
            statusText: `Building creation error: ${payload.statusText}`
        });
    },
    [BUILDING_LIST_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            buildingList: null,
            isGettingList: true,
            hasGottenList: false,
            statusText: null
        });
    },
    [BUILDING_LIST_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            buildingList: payload,
            isGettingList: false,
            hasGottenList: true,
            statusText: 'List of buildings returned'
        });
    },
    [BUILDING_LIST_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            buildingList: null,
            isGettingList: false,
            hasGottenList: false,
            statusText: `Building list error: ${payload.statusText}`
        });
    }
});
