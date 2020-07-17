import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Button,
  Heading,
  Textarea,
  Label,
  Dropdown
} from '@innovaccer/design-system';
import { useHistory } from 'react-router-dom';
import './Home.css';
import { getPatients, getNext } from '../api';
//import PatientList from '../components/PatientList';
import Info from '../components/Info';
import { PatientList } from '@innovaccer/fhir-components';

const Home = () => {
  let history = useHistory();
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
  const [invalidHeader, setHeaderStatus] = useState(false);
  const [modalState, setModalState] = useState(getServer() ? false : true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchGender, setSearchGender] = useState('');
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(false);
  const [errText, setErrText] = useState('');
  const [listLoading, setListLoading] = useState(true);

  const onModalClose = () => {
    if (getServer()) {
      setModalState(false);
      setServer(getServer());
    } else {
      return null;
    }
  };

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
      setHeaders(value);
    } catch (e) {
      setHeaderStatus(true);
      setHeaders(value);
    }
  };

  const updateServer = () => {
    localStorage.setItem('fhirServer', fhirServer);
    localStorage.setItem('serverHeaders', serverHeaders);
    setModalState(false);
    setPatients([]);
  };

  useEffect(() => {
    setServer(getServer());
    setHeaders(getHeaders());
    setError(false);
    if (getServer()) {
      setListLoading(true);
      getPatients(
        fhirServer,
        JSON.parse(serverHeaders)
      )({ name: searchQuery, gender: searchGender })
        .then((data) => {
          setPatients(data.data);
          setListLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
          setErrText('Something went wrong');
        });
    }
  }, [localStorage.getItem('fhirServer'), modalState]);

  const handleSearchInput = (value) => {
    setSearchQuery(value);
  };

  const handleGenderInput = (selected, name) => {
    setSearchGender(selected);
  };

  const handleSearch = () => {
    getPatients(
      fhirServer,
      JSON.parse(serverHeaders)
    )({ name: searchQuery, gender: searchGender })
      .then((data) => {
        setPatients(data.data);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setErrText('Something went wrong');
      });
  };

  const drillToPatientInfo = (ev, res) => {
    history.push(`/patients/${res.id}`);
  };

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ];

  const loadMore = (ev, next) => {
    // alert(next);
    getNext(next, JSON.parse(serverHeaders))
      .then((data) => {
        let temp = patients;
        data.data.entry = [...temp.entry, ...data.data.entry];
        setPatients(data.data);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setErrText('Something went wrong');
      });
  };

  const renderPatientList = () => {
    if (error) {
      return <Info text={errText} icon="error" />;
    } else {
      return (
        <div className="Home-PatientList">
          <div style={{ height: 'calc(100vh - 112px)', width: '45%', overflowY: 'scroll' }}>
            <PatientList
              resources={[patients]}
              onClick={drillToPatientInfo}
              loading={listLoading}
              loadMore={loadMore}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="Home">
      <Modal {...modalOptions}>
        <ModalHeader {...modalHeaderOptions} />
        <ModalBody>
          <Label style={{ margin: '0px 0 4px' }}>Address</Label>
          <Input
            clearButton={true}
            value={fhirServer}
            name="input"
            placeholder="Search"
            onChange={(ev) => handleServerInput(ev.target.value)}
            onClear={() => handleServerInput('')}
          />
          <Label style={{ margin: '8px 0 4px' }}>Headers</Label>
          <Textarea
            name="Textarea"
            placeholder="Headers"
            rows={5}
            onChange={(ev) => handleHeaderInput(ev.target.value)}
            defaultValue={serverHeaders}
            error={invalidHeader}
          />
        </ModalBody>
        <ModalFooter>
          <Button appearance="primary" onClick={() => updateServer()} disabled={!fhirServer || invalidHeader}>
            Submit
          </Button>
        </ModalFooter>
      </Modal>
      <div className="PageHeader-wrapper">
        <div className="PageHeader">
          <Heading size="m">Patients</Heading>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button appearance="primary" onClick={() => setModalState(true)}>
              Change Server
            </Button>
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
        <div style={{ width: '150px' }}>
          <Dropdown options={genderOptions} placeholder={'Gender'} onChange={handleGenderInput} />
        </div>
        <Button appearance="primary" onClick={() => handleSearch()}>
          Search
        </Button>
      </div>
      {renderPatientList()}
    </div>
  );
};

export default Home;
