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
    const response = await axios.get(API_URL+`/game/${payload.gameId || ""}?page=${payload.page || 0}&limit=${payload.limit || 50}`);

    return response.data;
}

export const getPlaysByUsername = async (payload) => {
    const response = await axios.get(API_URL+`/username/${payload.username || ""}?page=${payload.page || 0}&limit=${payload.limit || 50}`);

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

export const getPlayById = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL+`/${payload}`, config);

    return response.data;
}

export const updatePlay = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(API_URL+`/${payload.playId}`, payload, config);

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

export const getGamePlayStats = async (payload) => {
    const response = await axios.get(API_URL+`/stats/${payload}`);

    return response.data;
}




const playService = {
    getMyPlays,
    getPlayById,
    updatePlay,
    getPlaysByGame,
    getPlaysByUsername,
    createPlay,
    deletePlay,
    getGamePlayStats
};

export default playService;