import React, { useState, useEffect } from 'react';
import { PageHeader, Breadcrumbs, Card } from '@innovaccer/design-system';
import { useHistory, useParams } from 'react-router-dom';
import './Summary.css';
import { getPatientData } from '../api';
import PatientInfo from '../components/PatientInfo';

const Summary = () => {
  let history = useHistory();
  const params = useParams();
  const patientId = params.id;
  const getServer = () => {
    const server = localStorage.getItem('fhirServer');
    return server ? server : '';
  };

  const [fhirServer, setServer] = useState(getServer());
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    setServer(getServer());
    if (getServer()) {
      getPatientData(fhirServer)(patientId)
      .then(data => {
        setPatientData(data.data);
      })
      .catch(err => {
        console.log(err)
      })
    } else {
      history.push('/');
    }
  }, [localStorage.getItem('fhirServer')]);

  console.log(patientData)

  const breadcrumbData = [
    {
      label: 'Home',
      link: '/'
    }
  ];

  const pageheaderOptions = {
    title: `Patient Summary`,
    breadcrumb: (
      <Breadcrumbs
        list={breadcrumbData}
        onClick={link => history.push(link)}
      />
    )
  }

  return (
    <div className="Summary">
      <PageHeader {...pageheaderOptions} />
      <div className="Summary-body">
        {patientData && <PatientInfo data={patientData} />}
      </div>
    </div>
  );
};

export default Summary;
