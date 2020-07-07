import React, { useState, useEffect } from 'react';
import { PageHeader, Breadcrumbs, Card, Icon, Subheading } from '@innovaccer/design-system';
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

  // state for data
  const [patientData, setPatientData] = useState(null);
  const [vitalsData, setVitalsData] = useState([]);
  const [encounterData, setEncounterData] = useState([]);
  const [conditionData, setConditionData] = useState([]);
  const [immunizationData, setImmunizationData] = useState([]);

  // state for error
  const [error, setError] = useState(false);

  // state for loading
  const [patientLoading, setPatientLoading] = useState(true);
  const [vitalsLoading, setVitalsLoading] = useState(true);
  const [encounterLoading, setEncounterLoading] = useState(true);
  const [conditionLoading, setConditionLoading] = useState(true);
  const [immuneLoading, setImmuneLoading] = useState(true);

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
          setPatientLoading(false);
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
          setVitalsLoading(false);
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
          setEncounterLoading(false);
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
          setConditionLoading(false);
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
          setImmuneLoading(false);
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
      <div className="Summary-body">
        <PatientInfo data={patientData} loading={patientLoading} />
      </div>
      <div className="Summary-table">
        <div className="Summary-table-heading">
          <Icon size="23" name="add_box" />
          <Subheading>Vitals</Subheading>
        </div>
        <Vitals data={vitalsData} loading={vitalsLoading} />
      </div>
      <div className="Summary-table">
        <div className="Summary-table-heading">
          <Icon size="23" name="emoji_people" />
          <Subheading>Encounters</Subheading>
        </div>
        <Encounter
          fhirServer={fhirServer}
          serverHeaders={JSON.parse(serverHeaders)}
          data={encounterData}
          loading={encounterLoading}
        />
      </div>
      <div className="Summary-table">
        <div className="Summary-table-heading">
          <Icon size="23" name="check_box" />
          <Subheading>Condition</Subheading>
        </div>
        <Condition data={conditionData} loading={conditionLoading} />
      </div>
      <div className="Summary-table">
        <div className="Summary-table-heading">
          <Icon size="23" name="event_note" />
          <Subheading>Immunization</Subheading>
        </div>
        <Immunization data={immunizationData} loading={immuneLoading} />
      </div>
    </div>
  );
};

export default Summary;
