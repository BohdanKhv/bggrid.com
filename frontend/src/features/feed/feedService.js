import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/feed';

export const getCommunityFeed = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + '/community' + `?limit=${payload.limit}&page=${payload.page}&type=${payload.type}`, config);

    return response.data;
}

export const getCommunityFeedForYou = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + '/community-for-you' + `?limit=${payload.limit}&page=${payload.page}&type=${payload.type}`, config);

    return response.data;
}

export const getHomeFeed = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + '/home', config);

    return response.data;
}

export const getGeneralHomeFeed = async () => {
    const response = await axios.get(API_URL + '/general-home');

    return response.data;
}

const feedService = {
    getCommunityFeedForYou,
    getCommunityFeed,
    getHomeFeed,
    getGeneralHomeFeed
};

export default feedService;