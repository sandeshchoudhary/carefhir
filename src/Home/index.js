import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Input, Button, Heading } from '@innovaccer/design-system';
import './Home.css';
import { getPatients } from '../api';
import PatientList from '../components/PatientList';

const Home = () => {
  const getServer = () => {
    const server = localStorage.getItem('fhirServer');
    return server ? server : '';
  };

  const [fhirServer, setServer] = useState(getServer());
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

  const updateServer = () => {
    localStorage.setItem('fhirServer', fhirServer);
    setModalState(false);
  }

  useEffect(() => {
    setServer(getServer());
    if (getServer()) {
      getPatients(fhirServer)(searchQuery)
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
    getPatients(fhirServer)(searchQuery)
      .then(data => {
        setPatients(data.data);
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="Home">
      <Modal {...modalOptions}>
        <ModalHeader {...modalHeaderOptions} />
        <ModalBody>
        <Input
          clearButton={true}
          value={fhirServer}
          name="input"
          placeholder="Search"
          onChange={(ev) => handleServerInput(ev.target.value)}
          onClear={() => handleServerInput('')}
        />
        </ModalBody>
        <ModalFooter>
          <Button appearance="primary" onClick={() => updateServer()} disabled={!fhirServer}>Submit</Button>
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
      {patients && patients.total > 0 && (
        <div style={{height: 'calc(100vh - 112px', overflowY: 'scroll'}}>
          <PatientList
            data={patients}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
