// Redux reducer function
const initialState = {
    recipients: []
};

const recipients = (state = initialState, action) => {
    switch (action.type) {
        case 'RECIPIENT_CONTENT': {
            return {
                ...state,
                recipients: action.payload
            };
        }
        default:
            return state;
    }
};
export default recipients;
