import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/notifications';



// Get my notifications
// Private
// Payload: (token)
export const getNotifications = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await axios.get(`${API_URL}`, config);

    return res.data;
}

// Update notification to read
// Private
// Payload: (search)
export const updateNotificationToRead = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await axios.post(API_URL + '/read/' + id, {}, config);

    return res.data;
}

// Bulk update notification
// Private
// Payload: (search)
export const bulkUpdateNotification = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await axios.post(API_URL + '/bulk', payload, config);

    return res.data;
}

// Update notification to dismissed
// Private
// Payload: (search)
export const updateNotificationToDismissed = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await axios.post(API_URL + '/dismiss/' + id, {}, config);

    return res.data;
}


const notificationService = {
    getNotifications,
    updateNotificationToRead,
    bulkUpdateNotification,
    updateNotificationToDismissed,
}

export default notificationService;