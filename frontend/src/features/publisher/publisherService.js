import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/publishers';

export const getPublishers = async (payload) => {
    const response = await axios.get(API_URL+`${payload || ""}`);

    return response.data;
}

export const getPublisherById = async (payload) => {
    const response = await axios.get(API_URL+`/${payload || ""}`);

    return response.data;
}


const publisherService = {
    getPublishers,
    getPublisherById
};

export default publisherService;