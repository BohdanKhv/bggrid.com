import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/follow';

export const getFollowers = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + "/followers/" + payload, config);

    return response.data;
}

export const getFollowing = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + "/following/" + payload, config);

    return response.data;
}


export const followUser = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL + "/follow/" + payload, null, config);

    return response.data;
}


export const unfollowUser = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.delete(API_URL + "/unfollow/" + payload, config);

    return response.data;
}


const followService = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
};

export default followService;