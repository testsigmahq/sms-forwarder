// Redux reducer function
const initialState = {
    googleInfo: []
};

const google = (state = initialState, action) => {
    switch (action.type) {
        case 'GOOGLE_INFO': {
            return {
                ...state,
                googleInfo: action.payload
            };
        }
        default:
            return state;
    }
};
export default google;
