import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/friends';

export const getCommunityFeed = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + '/community', config);

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

const friendService = {
    getCommunityFeed,
    getHomeFeed
};

export default friendService;