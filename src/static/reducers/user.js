import { createReducer } from '../utils';
import { 
    USER_GET_CURRENT_REQUEST, USER_GET_CURRENT_SUCCESS, USER_GET_CURRENT_FAILURE, USER_GET_CURRENT_RESET,
    USER_FAVORITE_CREATE_REQUEST, USER_FAVORITE_CREATE_SUCCESS, USER_FAVORITE_CREATE_FAILURE, USER_FAVORITE_CREATE_RESET,
    USER_FAVORITE_SHARE_REQUEST, USER_FAVORITE_SHARE_SUCCESS, USER_FAVORITE_SHARE_FAILURE, USER_FAVORITE_SHARE_RESET,
    USER_FAVORITE_COUNT_REQUEST, USER_FAVORITE_COUNT_SUCCESS, USER_FAVORITE_COUNT_FAILURE
} from '../constants';

const initialState = {
    isGettingCurrentUser: false,
    hasGottenCurrentUser: false,
    user: null,
    isCreatingFavorite: false,
    hasCreatedFavorite: false,
    favoriteID: null,
    isSendingFavorites: false,
    hasSentFavorites: false,
    isGettingFavoritesCount: false,
    hasGottenFavoritesCount: false,
    statusText: null
};

export default createReducer(initialState, {
    [USER_GET_CURRENT_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingCurrentUser: true,
            hasGottenCurrentUser: false,
            user: null,
            statusText: null
        });
    },
    [USER_GET_CURRENT_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingCurrentUser: false,
            hasGottenCurrentUser: true,
            user: payload,
            statusText: null
        });
    },
    [USER_GET_CURRENT_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingCurrentUser: false,
            hasGottenCurrentUser: false,
            user: null,
            statusText: `${payload.statusText}`
        });
    },
    [USER_GET_CURRENT_RESET]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingCurrentUser: false,
            hasGottenCurrentUser: false,
            user: null,
            statusText: null
        });
    },
    [USER_FAVORITE_CREATE_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isCreatingFavorite: true,
            hasCreatedFavorite: false,
            user: null,
            statusText: null
        });
    },
    [USER_FAVORITE_CREATE_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isCreatingFavorite: false,
            hasCreatedFavorite: true,
            favoriteID: payload.uuid,
            statusText: null
        });
    },
    [USER_FAVORITE_CREATE_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isCreatingFavorite: false,
            hasCreatedFavorite: false,
            user: null,
            statusText: `${payload.statusText}`
        });
    },
    [USER_FAVORITE_CREATE_RESET]: (state, payload) => {
        return Object.assign({}, state, {
            isCreatingFavorite: false,
            hasCreatedFavorite: false,
            user: null,
            statusText: null
        });
    },
    [USER_FAVORITE_SHARE_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isSendingFavorites: true,
            hasSentFavorites: false,
            statusText: null
        });
    },
    [USER_FAVORITE_SHARE_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isSendingFavorites: false,
            hasSentFavorites: true,
            statusText: null
        });
    },
    [USER_FAVORITE_SHARE_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isSendingFavorites: false,
            hasSentFavorites: false,
            statusText: `${payload.statusText}`
        });
    },
    [USER_FAVORITE_SHARE_RESET]: (state, payload) => {
        return Object.assign({}, state, {
            isSendingFavorites: false,
            hasSentFavorites: false,
            statusText: null
        });
    },
    [USER_FAVORITE_COUNT_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingFavoritesCount: true,
            hasGottenFavoritesCount: false,
            statusText: null
        });
    },
    [USER_FAVORITE_COUNT_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingFavoritesCount: false,
            hasGottenFavoritesCount: true,
            statusText: null
        });
    },
    [USER_FAVORITE_COUNT_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingFavoritesCount: false,
            hasGottenFavoritesCount: false,
            statusText: `${payload.statusText}`
        });
    }
});
