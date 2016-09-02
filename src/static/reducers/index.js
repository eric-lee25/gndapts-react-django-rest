import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authReducer from './auth';
import dataReducer from './data';
import accountReducer from './account';
import buildingReducer from './building';
import unitReducer from './unit';
import reviewReducer from './review';

export default combineReducers({
    auth: authReducer,
    data: dataReducer,
    building: buildingReducer,
    routing: routerReducer,
    unit: unitReducer,
    review: reviewReducer,
    account: accountReducer
});
