import { combineReducers } from 'redux';
import  recipients from '../reducers/recipients'

const rootReducer = combineReducers({
    recipients,
})

export default rootReducer;
