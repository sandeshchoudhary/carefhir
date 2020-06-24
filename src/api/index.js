import axios from 'axios';

export const getPatients = serverAddress => (name = '') => {
  return axios.get(`${serverAddress}/Patient?name=${name}`);
}