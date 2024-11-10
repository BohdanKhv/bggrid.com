import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/games';

export const getGameById = async (payload) => {
    const response = await axios.get(API_URL+`/`, payload);

    return response.data;
}

export const getGames = async (payload) => {
    const response = await axios.get(API_URL+`${payload || ""}`);

    return response.data;
}


const listingService = {
    getGames,
    getGameById
};

export default listingService;