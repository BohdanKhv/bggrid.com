import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/users';

export const getUserProfile = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL+`/${payload || ""}`, config);

    return response.data;
}

export const searchUsers = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL+`/search${payload || ""}`, config);

    return response.data;
}


const userService = {
    getUserProfile,
    searchUsers
};

export default userService;