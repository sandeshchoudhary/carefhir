import axios from 'axios';

let querProp = {
  stringifyQueryParams(params) {
    return Object.keys(params)
      .reduce((all, key) => {
        if (params[key] && params[key] !== '') {
          if (Array.isArray(params[key])) {
            if (params[key].length > 0) {
              const temp = JSON.stringify(params[key]);
              all.push(`${key}=${encodeURI(temp)}`);
            }
          } else {
            all.push(`${key}=${encodeURI(params[key])}`);
          }
        }
        return all;
      }, [])
      .join('&');
  }
};

export const getPatients = (serverAddress, serverHeaders = {}) => (params) => {
  const queryParams = querProp.stringifyQueryParams(params);
  return axios.get(`${serverAddress}/Patient?${queryParams}`, {
    headers: serverHeaders
  });
};

export const getPatientData = (serverAddress, serverHeaders = {}) => (id) => {
  return axios.get(`${serverAddress}/Patient/${id}`, {
    headers: serverHeaders
  });
};

export const getObservationData = (serverAddress, serverHeaders = {}) => (id) => {
  return axios.get(`${serverAddress}/Observation?patient=${id}`, {
    headers: serverHeaders
  });
};

export const getVitalsData = (serverAddress, serverHeaders = {}) => (id) => {
  // to get only some vitals use loinc codes
  // use [base]/Observation?patient=patient_id&code=loinc_code1,loinc_code2

  return axios.get(`${serverAddress}/Observation?patient=${id}&category=vital-signs`, {
    headers: serverHeaders
  });
};

export const getEncounterData = (serverAddress, serverHeaders = {}) => (id) => {
  return axios.get(`${serverAddress}/Encounter?patient=${id}`, {
    headers: serverHeaders
  });
};

export const getConditionData = (serverAddress, serverHeaders = {}) => (id) => {
  return axios.get(`${serverAddress}/Condition?patient=${id}`, {
    headers: serverHeaders
  });
};

export const getImmunizationData = (serverAddress, serverHeaders = {}) => (id) => {
  return axios.get(`${serverAddress}/Immunization?patient=${id}`, {
    headers: serverHeaders
  });
};

export const getAllergyIntoleranceData = (serverAddress, serverHeaders = {}) => (id) => {
  return axios.get(`${serverAddress}/AllergyIntolerance?patient=${id}`, {
    headers: serverHeaders
  });
};

export const getNext = (nextLink, serverHeaders = {}) => {
  return axios.get(`${nextLink}`, {
    headers: serverHeaders
  });
};
