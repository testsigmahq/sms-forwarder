export const SetRecipientsInfo = (data) => {
    return {
        type: 'RECIPIENT_CONTENT',
        payload: data,
    };
};


export const googleInfo = (data) => {
    return {
        type: 'GOOGLE_INFO',
        payload: data,
    };
};