import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-4ad8e.firebaseio.com/'
});

export default instance;