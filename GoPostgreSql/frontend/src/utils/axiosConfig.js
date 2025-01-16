import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000';
axios.defaults.baseURL = backendUrl;
export default axios;