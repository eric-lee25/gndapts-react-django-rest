import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import jwtDecode from 'jwt-decode';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import {
    UNIT_CREATE_REQUEST,
    UNIT_CREATE_FAILURE,
    UNIT_CREATE_SUCCESS,
    UNIT_LIST_REQUEST,
    UNIT_LIST_FAILURE,
    UNIT_LIST_SUCCESS
} from '../constants';


export function unitCreateSuccess(unitID) {
    return {
        type: UNIT_CREATE_SUCCESS,
        payload: {
            unitID: unitID 
        }
    };
}

export function unitCreateFailure(error) {
    return {
        type: UNIT_CREATE_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function unitCreateRequest() {
    return {
        type: UNIT_CREATE_REQUEST
    };
}

export function createUnit(token, number, numBeds, numBaths, leaseType, title, amenities, description, rent, securityDeposit, buildingID, redirect) {
    return (dispatch) => {
        dispatch(unitCreateRequest());
        return fetch(`${SERVER_URL}/api/v1/base/units`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            },
            body: JSON.stringify({
                "type_lease": leaseType, number, "num_beds":numBeds, "num_baths":numBaths, title, amenities, description, rent, "security_deposit":securityDeposit,
                "building":buildingID
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(unitCreateSuccess(response));
                    dispatch(push(redirect));
                } catch (e) {
                    dispatch(unitCreateFailure({
                        response: {
                            status: 403,
                            statusText: 'Error creating unit.'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(unitCreateFailure(error));
            });
    };
}

export function unitListSuccess(unitList) {
    return {
        type: UNIT_LIST_SUCCESS,
        payload: unitList
    };
}

export function unitListFailure(error) {
    return {
        type: UNIT_LIST_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function unitListRequest() {
    return {
        type: UNIT_LIST_REQUEST
    };
}

export function listUnits(token) {
    return (dispatch) => {
        dispatch(unitListRequest());
        return fetch(`${SERVER_URL}/api/v1/base/units`, {
            method: 'get',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            },
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(unitListSuccess(response));
                } catch (e) {
                    dispatch(unitListFailure({
                        response: {
                            status: 403,
                            statusText: e
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(unitListFailure(error));
            });
    };
}
