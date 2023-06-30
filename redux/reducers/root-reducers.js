import { combineReducers } from 'redux';
import  recipients from '../reducers/recipients'
import google from "./google";
import messageTemplate from "./message-template";

const rootReducer = combineReducers({
    recipients,
    messageTemplate
})

export default rootReducer;
