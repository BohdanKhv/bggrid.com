import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/plays';

export const getMyPlays = async (query, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + `/my-plays${query}`, config);

    return response.data;
}

export const getPlaysByGame = async (payload) => {
    const response = await axios.get(API_URL+`${payload || ""}`);

    return response.data;
}

export const createPlay = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL, payload, config);

    return response.data;
}

export const deletePlay = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.delete(API_URL + `/${payload}`, config);

    return response.data;
}




const playService = {
    getMyPlays,
    getPlaysByGame,
    createPlay,
    deletePlay
};

export default playService;