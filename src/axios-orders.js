import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burgerbuilder-3e3a8.firebaseio.com/'
});

export default instance;