export const getCurrentTime = (logType) => {
    const now = new Date();
    return "[ " + now.toISOString().slice(11, 23) + " ] : [" + logType + "] : ";
};

