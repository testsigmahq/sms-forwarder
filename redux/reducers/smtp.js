// Redux reducer function
const initialState = {
    smtp: ''
};

const smtp = (state = initialState, action) => {
    switch (action.type) {
        case 'SMTP': {
            return {
                ...state,
                smtp: action.payload
            };
        }
        default:
            return state;
    }
};
export default smtp;
