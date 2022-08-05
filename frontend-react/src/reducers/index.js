import { combineReducers } from 'redux';
import authenticate from './auth';

const allReducers = combineReducers({
    auth: authenticate
});

export default allReducers;