import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/auth/';



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

export const register = async (data, token) => {
    const response = await axios.post(API_URL, data);

    return response.data;
}

export const updateUser = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };

    const response = await axios.put(API_URL, payload, config);

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

export const forgotPassword = async (data) => {
    const response = await axios.post(`${API_URL}forgot-password`, data);

    return response.data;
}

export const resetPassword = async (data) => {
    const response = await axios.post(`${API_URL}reset-password`, data);
    
    return response.data;
}



const authService = {
    sendLoginEmail,
    logout,
    register,
    login,
    updateUser,
    getMe,
    forgotPassword,
    resetPassword
};

export default authService;