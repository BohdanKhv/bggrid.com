import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/users/';



export const sendLoginEmail = async (payload) => {
    const response = await axios.post(API_URL + "get-login-link", payload);

    return response.data;
};

export const login = async (userData) => {
    const response = await axios.post(`${API_URL}login`, userData);

    return response.data;
}

export const logout = async () => {
    localStorage.removeItem('user'); // Remove user from localStorage
}


export const updateUser = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };

    const response = await axios.put(API_URL, userData, config);

    return response.data;
}


export const uploadResume = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };

    const response = await axios.put(API_URL + "resume", userData, config);

    return response.data;
}


export const getMe = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };

    const response = await axios.get(API_URL + 'me', config);

    return response.data;
}


const authService = {
    sendLoginEmail,
    logout,
    login,
    updateUser,
    uploadResume,
    getMe
};

export default authService;