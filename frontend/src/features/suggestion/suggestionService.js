import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/suggestions';


export const getLocations = async (q) => {
    const response = await axios.get(API_URL+`/locations?q=${q}`);

    return response.data;
};

export const getJobs = async (q) => {
    const response = await axios.get(API_URL+`/jobs?q=${q}`);

    return response.data;
};

const suggestionService = {
    getLocations,
    getJobs
};

export default suggestionService;