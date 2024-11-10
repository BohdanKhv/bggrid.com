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


const listingService = {
    getMyLibrary,
};

export default listingService;