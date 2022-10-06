import axios from 'axios';
const API = axios.create({
    /*baseURL: 'https://worldtravel-trip.com/qrecruit/api/',
    publicURL: 'https://worldtravel-trip.com/qrecruit',
    frontURL: '/qrecruit',*/
    baseURL: 'http://localhost:8000/api/',
    publicURL: 'http://localhost:8000',
    frontURL: '',
});
API.defaults.headers.common['api-key'] = 'base64:WXqlcIVsOU4o9TfGJcPnB/9yYgSsqIgkaNHOJcJXvRI=';

export default API;