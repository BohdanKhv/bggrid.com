import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/listings';


export const getMyListings = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.get(API_URL+`/my-listings`, config);

    return response.data;
};

export const getListings = async (payload) => {
    const response = await axios.get(API_URL+`?${payload}`);

    return response.data;
};

export const createListing = async (payload) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    };

    const response = await axios.post(API_URL, payload, config);

    return response.data;
};

export const createFreeListing = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.post(API_URL + "/free", payload, config);

    return response.data;
};

export const getCheckoutSession = async (id) => {
    const response = await axios.get(API_URL + `/checkout-session/${id}`);

    return response.data;
}

export const getMyListingById = async (id,  token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.get(API_URL + `/my/${id}`, config);

    return response.data;
};

export const getListingById = async (id) => {
    const response = await axios.get(API_URL + `/${id}`);

    return response.data;
};

export const updateListing = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    const response = await axios.put(API_URL+`/${payload._id}`, payload, config);

    return response.data;
};

export const getListingsById = async (payload) => {
    const response = await axios.post(API_URL+`/get-listings-by-id`, payload);

    return response.data;
}

export const geoSearch = async (payload) => {
    const response = await axios.get(API_URL+`/geo-search?${payload}`);

    return response.data;
}


const listingService = {
    getMyListings,
    getListings,
    getMyListingById,
    createListing,
    createFreeListing,
    getCheckoutSession,
    getListingById,
    updateListing,
    getListingsById,
    geoSearch
};

export default listingService;