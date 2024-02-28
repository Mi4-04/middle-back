import axios from 'axios';

export default axios.create({
  baseURL: process.env.BASE_MUSIC_API_URL,
});
