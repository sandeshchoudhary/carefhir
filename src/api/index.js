import axios from 'axios';

export const getPatients = serverAddress => (name = '') => {
  return axios.get(`${serverAddress}/Patient?name=${name}`);
}

export const getPatientData = serverAddress => (id) => {
  return axios.get(`${serverAddress}/Patient/${id}`);
}