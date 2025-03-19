import axios from 'axios';

const apiClient = axios.create({
    // baseURL: 'http://192.168.2.11:8080',
    baseURL: 'http://124.220.206.34:8080', // Spring Boot 项目的地址
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

export default {
    getLogin() {
        return apiClient.get('/api/Login');
    }
};