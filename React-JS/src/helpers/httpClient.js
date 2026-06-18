import axios from 'axios';
import { API_BASE_PATH } from './constants';

const httpClient = axios.create({
  baseURL: API_BASE_PATH,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default httpClient;
