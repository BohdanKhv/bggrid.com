import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/friends';

export const getMyFriends = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL, config);

    return response.data;
}


export const sendFriendRequest = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL+`/send/${payload}`, null, config);

    return response.data;
}


export const acceptFriendRequest = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL+`/accept/${payload}`, null, config);

    return response.data;
}


export const declineFriendRequest = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL+`/decline/${payload}`, null, config);

    return response.data;
}


export const removeFriend = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL+`/remove/${payload}`, null, config);

    return response.data;
}


const friendService = {
    getMyFriends,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend
};

export default friendService;