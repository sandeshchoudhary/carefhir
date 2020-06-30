import axios from 'axios';

export const getPatients = (serverAddress, serverHeaders = {}) => (name = '') => {
  return axios.get(`${serverAddress}/Patient?name=${name}`, {
    headers: serverHeaders
  });
}

export const getPatientData = (serverAddress, serverHeaders = {}) => (id) => {
  return axios.get(`${serverAddress}/Patient/${id}`, {
    headers: serverHeaders
  });
}