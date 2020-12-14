import axios from 'axios';

const api = axios.create({
    baseURL: "https://tranquil-gorge-34252.herokuapp.com/"
})

export default api;