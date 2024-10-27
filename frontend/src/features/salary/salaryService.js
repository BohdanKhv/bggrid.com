import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/salaries';



export const getSalary = async (payload) => {
    const response = await axios.get(API_URL + `?position=${payload.position}&location=${payload.location}`);

    return response.data;
};

const salaryService = {
    getSalary,
};

export default salaryService;