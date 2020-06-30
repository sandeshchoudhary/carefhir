import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Input, Button, Heading, Textarea, Label } from '@innovaccer/design-system';
import { useHistory } from 'react-router-dom';
import './Home.css';
import { getPatients } from '../api';
import PatientList from '../components/PatientList';

const Home = () => {
  let history = useHistory();
  const getServer = () => {
    const server = localStorage.getItem('fhirServer');
    return server ? server : '';
  };

  const getHeaders = () => {
    const data = localStorage.getItem('serverHeaders');
    return data ? data: '{}';
  };

  const [fhirServer, setServer] = useState(getServer());
  const [serverHeaders, setHeaders] = useState(getHeaders());
  const [invalidHeader, setHeaderStatus] = useState(false);
  const [modalState, setModalState] = useState(getServer() ? false : true);
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);

  const onModalClose = () => {
    if (getServer()) {
      setModalState(false);
      setServer(getServer())
    } else {
      return null;
    }
  }

  const modalOptions = {
    open: modalState,
    onClose: onModalClose,
    backdrop: false,
    dimension: 'small'
  };

  const modalHeaderOptions = {
    onClose: onModalClose,
    icon: 'pan_tool',
    heading: 'FHIR Server',
    subHeading: 'FHIR Server address'
  };

  const handleServerInput = (value) => {
    setServer(value);
  };

  const handleHeaderInput = (value) => {
    let temp;
    try {
      temp = JSON.parse(value);
      setHeaderStatus(false);
      setHeaders(value)
    } catch (e) {
      setHeaderStatus(true);
      setHeaders(value);
    };
  };

  const updateServer = () => {
    localStorage.setItem('fhirServer', fhirServer);
    localStorage.setItem('serverHeaders', serverHeaders);
    setModalState(false);
    setPatients([]);
  }

  useEffect(() => {
    setServer(getServer());
    setHeaders(getHeaders());
    if (getServer()) {
      getPatients(fhirServer, JSON.parse(serverHeaders))(searchQuery)
      .then(data => {
        setPatients(data.data);
      })
      .catch(err => {
        console.log(err)
      })
    }
  }, [localStorage.getItem('fhirServer'), modalState]);

  const handleSearchInput = (value) => {
    setSearchQuery(value);
  };

  const handleSearch = () => {
    getPatients(fhirServer, JSON.parse(serverHeaders))(searchQuery)
      .then(data => {
        setPatients(data.data);
      })
      .catch(err => {
        console.log(err)
      })
  }

  const drillToPatientInfo = (ev, id) => {
    history.push(`/patients/${id}`);
  };

  console.log(patients)

  return (
    <div className="Home">
      <Modal {...modalOptions}>
        <ModalHeader {...modalHeaderOptions} />
        <ModalBody>
          <Label style={{margin: '0px 0 4px'}}>Address</Label>
          <Input
            clearButton={true}
            value={fhirServer}
            name="input"
            placeholder="Search"
            onChange={(ev) => handleServerInput(ev.target.value)}
            onClear={() => handleServerInput('')}
          />
          <Label style={{margin: '8px 0 4px'}}>Headers</Label>
          <Textarea
            name="Textarea"
            placeholder="Headers"
            rows={5}
            onChange={ev => handleHeaderInput(ev.target.value)}
            defaultValue={serverHeaders}
            error={invalidHeader} />
        </ModalBody>
        <ModalFooter>
          <Button appearance="primary" onClick={() => updateServer()} disabled={!fhirServer || invalidHeader}>Submit</Button>
        </ModalFooter>
      </Modal>
      <div className="PageHeader-wrapper">
        <div className="PageHeader">
          <Heading size="m">Patients</Heading>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button appearance="primary" onClick={() => setModalState(true)}>Change Server</Button>
          </div>
        </div>
      </div>
      <div className="Search-wrapper">
        <Input
          clearButton={true}
          value={searchQuery}
          icon="search"
          name="input"
          placeholder="Search"
          onChange={(ev) => handleSearchInput(ev.target.value)}
          onClear={() => handleSearchInput('')}
          />
        <Button appearance="primary" onClick={() => handleSearch()}>Search</Button>
      </div>
      {patients && patients.entry && patients.entry.length > 0 && (
        <div style={{height: 'calc(100vh - 112px', overflowY: 'scroll'}}>
          <PatientList
            data={patients}
            onClick={drillToPatientInfo}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
