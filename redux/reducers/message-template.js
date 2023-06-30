
// Redux reducer function
const initialState = {
    messageTemplate: []
};

const MessageTemplate = (state = initialState, action) => {
    switch (action.type) {

        case 'MESSAGE_TEMPLATE':{
            return {
                ...state,
                messageTemplate:action.payload
            }
        }
        default:
            return state;
    }
};
export default MessageTemplate;



