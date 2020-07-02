import React, { useState, useEffect } from 'react';
import { PageHeader, Breadcrumbs, Card, Subheading } from '@innovaccer/design-system';
import { useHistory, useParams } from 'react-router-dom';
import './Summary.css';
import { getPatientData, getObservationData, getEncounterData } from '../api';
import PatientInfo from '../components/PatientInfo';
import ObservationTable from '../components/ObservationTable';
import Encounter from '../components/Encounter';
import Info from '../components/Info';
import { render } from '@testing-library/react';

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
  const [observationData, setObservationData] = useState(null);
  const [encounterData, setEncounterData] = useState(null);
  const [error, setError] = useState(false);
  const [loadingEncounter, setLoadingEncounter] = useState(true);
  const [loadingObservation, setLoadingObservation] = useState(true);
  const [loadingPatient, setLoadingPatient] = useState(true);

  console.log(patientId);
  useEffect(() => {
    setServer(getServer());
    setHeaders(getHeaders());
    //setLoadingEncounter(true);
    //setLoadingObservation(true);
    //setLoadingPatient(true);
    if (getServer()) {
      getPatientData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          setPatientData(data.data);
          setLoadingPatient(false);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });

      getObservationData(
        fhirServer,
        JSON.parse(serverHeaders)
      )(patientId)
        .then((data) => {
          const filtered = data.data && data.data.entry ? data.data.entry.map((e) => e.resource) : [];
          setObservationData(filtered);
          setLoadingObservation(false);
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
          const filtered = data.data && data.data.entry ? data.data.entry.map((e) => e.resource) : [];
          setEncounterData(filtered);
          setLoadingEncounter(false);
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

  const renderEncounter = () => {
    if (loadingEncounter) {
      return (
        <div className="Summary-table">
          <Subheading>Encounters</Subheading>
          <Encounter loading={loadingEncounter} />
        </div>
      );
    } else {
      return (
        encounterData && (
          <div className="Summary-table">
            <Subheading>Encounters</Subheading>
            <Encounter data={encounterData} />
          </div>
        )
      );
    }
  };

  const renderObservations = () => {
    if (loadingObservation) {
      return (
        <div className="Summary-table">
          <Subheading>Observations</Subheading>
          <ObservationTable loading={loadingObservation} />
        </div>
      );
    } else {
      return (
        encounterData && (
          <div className="Summary-table">
            <Subheading>Observations</Subheading>
            <ObservationTable data={observationData} />
          </div>
        )
      );
    }
  };

  const renderPatientInfo = () => {
    if (loadingPatient) {
      return (
        <div className="Summary-table">
          <PatientInfo loading={loadingPatient} />
        </div>
      );
    } else {
      return patientData && <PatientInfo data={patientData} />;
    }
  };

  return error ? (
    <Info text="Something went wrong" icon="error" />
  ) : (
    <div className="Summary">
      <PageHeader {...pageheaderOptions} />
      <div className="Summary-body">
        {renderPatientInfo()}
        {!loadingPatient && renderObservations()}
        {!loadingPatient && renderEncounter()}
      </div>
    </div>
  );
};

export default Summary;
