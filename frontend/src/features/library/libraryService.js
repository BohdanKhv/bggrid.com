import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/library';

export const getMyLibrary = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.get(API_URL+`/my-library`, config);

    return response.data;
}


export const addGameToLibrary = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.post(API_URL+`/`, payload, config);

    return response.data;
}


export const updateGameInLibrary = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.put(API_URL+`/` + payload?.gameId, payload, config);

    return response.data;
}


export const removeGameFromLibrary = async (gameId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.delete(API_URL+`/` + gameId, config);

    return response.data;
}


export const importBggCollection = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.post(API_URL+`/import-bgg-collection`, null, config);

    return response.data;
}



const listingService = {
    getMyLibrary,
    addGameToLibrary,
    updateGameInLibrary,
    removeGameFromLibrary,
    importBggCollection
};

export default listingService;