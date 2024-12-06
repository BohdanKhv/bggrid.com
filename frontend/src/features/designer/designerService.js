import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/designers';

export const getDesigners = async (payload) => {
    const response = await axios.get(API_URL+`${payload || ""}`);

    return response.data;
}

export const getDesignerById = async (payload) => {
    const response = await axios.get(API_URL+`/${payload || ""}`);

    return response.data;
}


const designerService = {
    getDesigners,
    getDesignerById
};

export default designerService;