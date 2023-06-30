
// Redux reducer function
const initialState = {
    messageTemplate: []
};

const MessageTemplate = (state = initialState, action) => {
    switch (action.type) {

        case 'MESSAGE_TEMPLATE':{
            return {
                ...state,
                templateTitle:action.payload.title,
                templatePreview:action.payload.preview
            }
        }
        default:
            return state;
    }
};
export default MessageTemplate;



