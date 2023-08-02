import { combineReducers } from 'redux';
import  recipients from '../reducers/recipients'
import google from "./google";
import messageTemplate from "./message-template";
import smtp from "./smtp";

const rootReducer = combineReducers({
    recipients,
    messageTemplate,
    google,
    smtp
})

export default rootReducer;
