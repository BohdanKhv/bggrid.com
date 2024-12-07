import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/persons';

export const getPersons = async (payload) => {
    const response = await axios.get(API_URL+`${payload || ""}`);

    return response.data;
}

export const getPersonById = async (payload) => {
    const response = await axios.get(API_URL+`/${payload || ""}`);

    return response.data;
}


const personService = {
    getPersons,
    getPersonById
};

export default personService;