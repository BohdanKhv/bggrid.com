import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/games';

export const getGameById = async (payload) => {
    const response = await axios.get(API_URL + `/` + payload);

    return response.data;
}

export const getGameOverview = async (payload) => {
    const response = await axios.get(API_URL + `/` + payload + '/overview');

    return response.data;
}

export const getGames = async (payload, token) => {
    let config = {};
    if (token) {
        config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    }

    const response = await axios.get(API_URL+`${payload || ""}`, config);

    return response.data;
}

export const getSuggestions = async (payload) => {
    const response = await axios.get(API_URL+`/suggestions?s=${payload}`);

    return response.data;
}


const listingService = {
    getGames,
    getGameById,
    getGameOverview,
    getSuggestions
};

export default listingService;