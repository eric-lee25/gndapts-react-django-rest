import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';

import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import { ACCOUNT_CREATE_USER_REQUEST, ACCOUNT_CREATE_USER_FAILURE, ACCOUNT_CREATE_USER_SUCCESS } from '../constants';


export function accountCreateUserSuccess() {
    return {
        type: ACCOUNT_CREATE_USER_SUCCESS,
    };
}

export function accountCreateUserFailure(error) {
    return {
        type: ACCOUNT_CREATE_USER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function accountCreateUserRequest() {
    return {
        type: ACCOUNT_CREATE_USER_REQUEST
    };
}

export function accountCreateUser(first_name, last_name, email, password) {
    return (dispatch) => {
        dispatch(accountCreateUserRequest());
        return fetch(`${SERVER_URL}/api/v1/accounts/register/`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name, last_name,
                email, password
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(accountCreateUserSuccess());
                } catch (e) {
                    dispatch(accountCreateUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Error creating account'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(accountCreateUserFailure(error));
            });
    };
}
