import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/notifications';



export const getMyNotification = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await axios.get(`${API_URL}?page=${payload.page || 10}&limit=${payload.limit || 10}`, config);

    return res.data;
}

export const readNotifications = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await axios.put(API_URL + '/read', null, config);

    return res.data;
}


const notificationService = {
    getMyNotification,
    readNotifications,
}

export default notificationService;