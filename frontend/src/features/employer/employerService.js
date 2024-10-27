import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/users/';



export const getEmployerProfile = async (id) => {
    const response = await axios.get(API_URL + "employers/" + id);

    return response.data;
};

export const getEmployers = async () => {
    const response = await axios.get(API_URL + "employers");

    return response.data;
}


const employerService = {
    getEmployerProfile,
    getEmployers
};

export default employerService;