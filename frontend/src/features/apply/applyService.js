import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/applies';


export const getMyApplications = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.get(API_URL+`/my-applications?${payload && payload.select ? `select=${payload.select}&` : ""}${payload && payload.populate ? `populate=${payload.populate}&` : ""}`, config);

    return response.data;
};

export const getApplicationsByListingId = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.get(API_URL+`/listing/${id}`, config);

    return response.data;
};

export const applyToListing = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.post(API_URL + '/apply/' + id, null, config);

    return response.data;
};


export const archiveApplication = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.post(API_URL + '/archive/' + id, null, config);

    return response.data;
};


const applyService = {
    getMyApplications,
    getApplicationsByListingId,
    applyToListing,
    archiveApplication
};

export default applyService;