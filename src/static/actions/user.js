import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import jwtDecode from 'jwt-decode';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import { 
    USER_GET_CURRENT_REQUEST, USER_GET_CURRENT_SUCCESS, USER_GET_CURRENT_FAILURE, USER_GET_CURRENT_RESET,
    USER_FAVORITE_CREATE_REQUEST, USER_FAVORITE_CREATE_SUCCESS, USER_FAVORITE_CREATE_FAILURE,
    USER_FAVORITE_SHARE_REQUEST, USER_FAVORITE_SHARE_SUCCESS, USER_FAVORITE_SHARE_FAILURE, USER_FAVORITE_SHARE_RESET,
    USER_FAVORITE_COUNT_REQUEST, USER_FAVORITE_COUNT_SUCCESS, USER_FAVORITE_COUNT_FAILURE
} from '../constants';

export function currentUserGetSuccess(user) {
    return {
        type: USER_GET_CURRENT_SUCCESS,
        payload: user
    };
}

export function currentUserGetFailure(error) {
    return {
        type: USER_GET_CURRENT_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function currentUserGetRequest() {
    return {
        type: USER_GET_CURRENT_REQUEST
    };
}

export function currentUserGetReset() {
    return {
        type: USER_GET_CURRENT_RESET
    };
}

export function resetCurrentUser() {
    return (dispatch) => {
        dispatch(currentUserGetReset());
    }
}

export function getCurrentUser(token) {
    return (dispatch) => {
        dispatch(currentUserGetRequest());
        return fetch(`${SERVER_URL}/api/v1/base/users/current`, {
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
                    dispatch(currentUserGetSuccess(response));
                } catch (e) {
                    dispatch(currentUserGetFailure({
                        response: {
                            status: 403,
                            statusText: e
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(currentUserGetFailure(error));
            });
    };
}

export function favoriteCreateSuccess(favoriteID) {
    return {
        type: USER_FAVORITE_CREATE_SUCCESS,
        payload: {
            favoriteID: favoriteID 
        }
    };
}

export function favoriteCreateFailure(error) {
    return {
        type: USER_FAVORITE_CREATE_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function favoriteCreateRequest() {
    return {
        type: USER_FAVORITE_CREATE_REQUEST
    };
}

export function createFavorite(token, buildingID, unitID) {
    return (dispatch) => {
        dispatch(favoriteCreateRequest());
        return fetch(`${SERVER_URL}/api/v1/base/favorites`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            },
            body: JSON.stringify({
                "building": buildingID,
                "unit": unitID
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(favoriteCreateSuccess(response));
                } catch (e) {
                    dispatch(favoriteCreateFailure({
                        response: {
                            status: 403,
                            statusText: 'Error creating favorite.'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(favoriteCreateFailure(error));
            });
    };
}

export function favoriteShareSuccess() {
    return {
        type: USER_FAVORITE_SHARE_SUCCESS,
    };
}

export function favoriteShareFailure(error) {
    return {
        type: USER_FAVORITE_SHARE_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function favoriteShareRequest() {
    return {
        type: USER_FAVORITE_SHARE_REQUEST
    };
}

export function favoriteShareReset() {
    return {
        type: USER_FAVORITE_SHARE_RESET
    };
}

export function resetShareFavorite() {
    return (dispatch) => {
        dispatch(favoriteShareReset());
    }
}

export function shareFavorite(token, emails) {
    return (dispatch) => {
        dispatch(favoriteShareRequest());
        return fetch(`${SERVER_URL}/api/v1/base/favorites/share`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            },
            body: JSON.stringify({
                "emails": emails,
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(favoriteShareSuccess(response));
                } catch (e) {
                    dispatch(favoriteShareFailure({
                        response: {
                            status: 403,
                            statusText: 'Error sharing favorite.'
                        }
                    }));
                }
            })
            .catch(function(errorObj) {
                return parseJSON(errorObj.response).then(
                    function (error) {
                        dispatch(favoriteShareFailure({
                            response: {
                                status: errorObj.response.status,
                                statusText: error.emails[0]
                            }
                        }));
                    })
            });
    };
}

export function favoriteCountSuccess() {
    return {
        type: USER_FAVORITE_COUNT_SUCCESS,
    };
}

export function favoriteCountFailure(error) {
    return {
        type: USER_FAVORITE_COUNT_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function favoriteCountRequest() {
    return {
        type: USER_FAVORITE_COUNT_REQUEST
    };
}

export function getFavoriteCount(token) {
    return (dispatch) => {
        dispatch(favoriteCountRequest());
        return fetch(`${SERVER_URL}/api/v1/base/user/favoritescount`, {
            method: 'post',
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
                    dispatch(favoriteCountSuccess(response));
                } catch (e) {
                    dispatch(favoriteCountFailure({
                        response: {
                            status: 403,
                            statusText: 'Error getting number of favorites.'
                        }
                    }));
                }
            })
            .catch(function(errorObj) {
                return parseJSON(errorObj.response).then(
                    function (error) {
                        dispatch(favoriteCountFailure({
                            response: {
                                status: errorObj.response.status,
                                statusText: error.emails[0]
                            }
                        }));
                    })
            });
    };
}
