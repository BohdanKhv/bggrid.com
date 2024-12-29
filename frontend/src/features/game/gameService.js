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

export const getGamesByPublisherId = async (payload) => {
    const response = await axios.get(API_URL+`/publisher/${payload || ""}`);

    return response.data;
}

export const getGamesByPersonId = async (payload) => {
    const response = await axios.get(API_URL+`/person/${payload || ""}`);

    return response.data;
}

export const getSuggestions = async (payload) => {
    const response = await axios.get(API_URL+`/suggestions?s=${payload}`);

    return response.data;
}

export const getHotGames = async () => {
    const response = await axios.get(API_URL+`/collection/hot`);

    return response.data;
}

export const getTrendingGames = async () => {
    const response = await axios.get(API_URL+`/collection/trending`);

    return response.data;
}

export const getMostPlayedGames = async () => {
    const response = await axios.get(API_URL+`/collection/most-played`);

    return response.data;
}

export const getBestsellerGames = async () => {
    const response = await axios.get(API_URL+`/collection/bestseller`);

    return response.data;
}

export const getForYouGames = async (token) => {
    let config = {};
    if (token) {
        config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    }

    const response = await axios.get(API_URL+`/collection/for-you`, config);

    return response.data;
}

export const getCollection = async (payload, token) => {
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


const listingService = {
    getGames,
    getGameById,
    getGamesByPublisherId,
    getGamesByPersonId,
    getGameOverview,
    getSuggestions,
    getHotGames,
    getTrendingGames,
    getMostPlayedGames,
    getBestsellerGames,
    getCollection,
    getForYouGames
};

export default listingService;