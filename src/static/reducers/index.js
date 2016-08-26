import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authReducer from './auth';
import dataReducer from './data';
import accountReducer from './account';
import buildingReducer from './building';
import unitReducer from './unit';

export default combineReducers({
    auth: authReducer,
    data: dataReducer,
    building: buildingReducer,
    routing: routerReducer,
    unit: unitReducer,
    account: accountReducer
});
