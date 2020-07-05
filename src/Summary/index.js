import React, { useState, useEffect } from 'react';
import { PageHeader, Breadcrumbs, Card, Subheading } from '@innovaccer/design-system';
import { useHistory, useParams } from 'react-router-dom';
import './Summary.css';
import { getPatientData, getVitalsData, getEncounterData, getConditionData, getImmunizationData } from '../api';
import PatientInfo from '../components/PatientInfo';
import Vitals from '../components/Vitals';
import Encounter from '../components/Encounter';
import Condition from '../components/Condition';
import Immunization from '../components/Immunization';
import Info from '../components/Info';

const Summary = () => {
  let history = useHistory();
  const params = useParams();
  const patientId = params.id;
  const getServer = () => {
    const server = localStorage.getItem('fhirServer');
    return server ? server : '';
  };

  const getHeaders = () => {
    const data = localStorage.getItem('serverHeaders');
    return data ? data : '{}';
  };

  const [fhirServer, setServer] = useState(getServer());
  const [serverHeaders, setHeaders] = useState(getHeaders());
  const [patientData, setPatientData] = useState(null);
  const [vitalsData, setVitalsData] = useState(null);
  const [encounterData, setEncounterData] = useState(null);
  const [conditionData, setConditionData] = useState(null);
  const [immunizationData, setImmunizationData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setServer(getServer());
    setHeaders(getHeaders());
    if (getServer()) {
      getPatientData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          setPatientData(data.data);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });

      getVitalsData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          const filtered = data.data.entry.map((e) => e.resource);
          setVitalsData(filtered);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });

      getEncounterData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          const filtered = data.data.entry.map((e) => e.resource);
          setEncounterData(filtered);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });

      getConditionData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          const filtered = data.data.entry.map((e) => e.resource);
          setConditionData(filtered);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });

      getImmunizationData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          const filtered = data.data.entry.map((e) => e.resource);
          setImmunizationData(filtered);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });
    } else {
      history.push('/');
    }
  }, [localStorage.getItem('fhirServer')]);

  const breadcrumbData = [
    {
      label: 'Home',
      link: '/'
    }
  ];

  const pageheaderOptions = {
    title: `Patient Summary`,
    breadcrumb: <Breadcrumbs list={breadcrumbData} onClick={(link) => history.push(link)} />
  };

  return error ? (
    <Info text="Something went wrong" icon="error" />
  ) : (
    <div className="Summary">
      <PageHeader {...pageheaderOptions} />
      <div className="Summary-body">{patientData && <PatientInfo data={patientData} />}</div>
      {vitalsData && (
        <div className="Summary-table">
          <Subheading>Vitals</Subheading>
          <Vitals data={vitalsData} />
        </div>
      )}
      {encounterData && (
        <div className="Summary-table">
          <Subheading>Encounters</Subheading>
          <Encounter fhirServer={fhirServer} serverHeaders={JSON.parse(serverHeaders)} data={encounterData} />
        </div>
      )}
      {conditionData && (
        <div className="Summary-table">
          <Subheading>Condition</Subheading>
          <Condition data={conditionData} />
        </div>
      )}
      {immunizationData && (
        <div className="Summary-table">
          <Subheading>Immunization</Subheading>
          <Immunization data={immunizationData} />
        </div>
      )}
    </div>
  );
};

export default Summary;
