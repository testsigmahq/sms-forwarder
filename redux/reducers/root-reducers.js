import { combineReducers } from 'redux';
import  recipients from '../reducers/recipients'
import google from "./google";

const rootReducer = combineReducers({
    recipients,
    google
})

export default rootReducer;
