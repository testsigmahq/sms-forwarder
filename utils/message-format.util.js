import Database from "../repository/database";
import {getCurrentTime} from "./date";

export function formatDateTime(timestamp) {
    const dateObject = new Date(timestamp);
    const formattedDateTime = dateObject.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${formattedDateTime}`;
}

export async function changeMessageText(id, latestObject) {
    let newMessage = latestObject?.body;
    const changeContent = await Database.fetchChangeContents(id);
    if (changeContent.length > 0) {
        changeContent.forEach((content) => {
            if (newMessage.includes(content.oldWord)) {
                newMessage = newMessage.replace(content.oldWord, content.newWord);
            }
        })
    }
    // newMessage = `From : ${latestObject?.address} \n` + newMessage;
    console.log(getCurrentTime("INFO") + "NewMessage :: ", newMessage);
    return newMessage;
}