import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/library';

export const getReviewsByGame = async (payload) => {
    const response = await axios.get(API_URL+`/reviews/${payload || ""}`);

    return response.data;
}


const reviewService = {
    getReviewsByGame,
};

export default reviewService;