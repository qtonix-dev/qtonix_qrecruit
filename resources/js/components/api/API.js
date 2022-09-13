import axios from 'axios';
const API = axios.create({
    /*baseURL: 'https://www.kafesta.com/qrecruit/api/',
    publicURL: 'https://www.kafesta.com/qrecruit',*/
    baseURL: 'http://localhost:8000/api/',
    publicURL: 'http://localhost:8000/qrecruit',
});
API.defaults.headers.common['api-key'] = 'base64:WXqlcIVsOU4o9TfGJcPnB/9yYgSsqIgkaNHOJcJXvRI=';

export default API;