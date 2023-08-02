export const SetRecipientsInfo = (data) => {
    return {
        type: 'RECIPIENT_CONTENT',
        payload: data,
    };
};

export const setSmtp = (data) => {
    return {
        type: 'SMTP',
        payload: data,
    };
};

export const googleInfo = (data) => {
    return {
        type: 'GOOGLE_INFO',
        payload: data,
    };
};

export const messageTemplate=(title,preview)=>{
    return{
        type:'MESSAGE_TEMPLATE',
        payload:{title,preview},
    }
}