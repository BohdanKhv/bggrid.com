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

export const getHomeFeed = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + '/home', config);

    return response.data;
}

const feedService = {
    getCommunityFeed,
    getHomeFeed
};

export default feedService;