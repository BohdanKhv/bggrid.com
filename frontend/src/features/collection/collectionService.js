import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL;

export const getCommunityFeed = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + '/community', config);

    return response.data;
}

const collectionService = {
    getCommunityFeed,
};

export default collectionService;