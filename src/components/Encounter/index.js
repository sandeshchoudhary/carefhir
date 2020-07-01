import axios from 'axios';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { schema } from './helpers';
import { Table } from '@innovaccer/design-system';
import Info from '../Info';

const Encounter = (props) => {
  const { data = [] } = props;

  // const serverAddress = 'https://r4.smarthealthit.org';

  // const getReferences = async (serverAddress, serverHeaders = {}, link) => {
  //   const ref = await axios.get(`${serverAddress}/${link}`, {
  //     headers: serverHeaders
  //   });

  //   return ref;
  // };

  // const getRefValues = async (resource) => {
  //   // const rType = resource.type && resource.type.length > 0 ? resource.type[0] : '-';
  //   // const lType = rType && rType.text ? rType.text : '-';
  //   // const startDate = resource.period ? resource.period.start : '-';
  //   const participant = resource.participant && resource.participant.length > 0 ? resource.participant[0] : '-';
  //   const providerRef = participant && participant.individual ? participant.individual.reference : '';
  //   const orgRef = resource.serviceProvider ? resource.serviceProvider.reference : '';
  //   let provider = '';
  //   let facility = '';

  //   if (providerRef !== '-') {
  //     const pRef = await getReferences(serverAddress, {}, providerRef);
  //     provider = pRef;
  //   }

  //   if (orgRef !== '-') {
  //     const fRef = await getReferences(serverAddress, {}, orgRef);
  //     facility = fRef;
  //   }
  //   // const facility = (await orgRef) !== '' ? getReferences(serverAddress, {}, orgRef) : '-';

  //   const provName = provider === '-' ? '-' : `${provider.data.name[0].given[0]}, ${provider.data.name[0].family}`;
  //   const orgName = facility === '-' ? '-' : facility.data.name;
  //   const orgContact = facility === '-' ? '-' : facility.data.telecom;
  //   const orgSys = Array.isArray(orgContact) ? orgContact[0].system : '-';
  //   const orgTel = orgSys === 'phone' ? orgContact[0].value : '-';

  //   // console.table([provName, orgName, orgTel]);
  //   return [provName, orgName, orgTel];
  // };

  const getValObj = (resource) => {
    const rType = resource.type && resource.type.length > 0 ? resource.type[0] : '-';
    const lType = rType && rType.text ? rType.text : '-';
    const sDate = resource.period ? resource.period.start : '-';
    const dateStr = sDate === '-' ? '-' : new Date(sDate);
    const startDate = dateStr === '-' ? '-' : `${dateStr.getMonth() + 1}-${dateStr.getDay()}-${dateStr.getFullYear()}`;
    const participant = resource.participant && resource.participant.length > 0 ? resource.participant[0] : '-';
    let providerRef = participant && participant.individual ? participant.individual.reference : '';
    let orgRef = resource.serviceProvider ? resource.serviceProvider.reference : '';

    providerRef = providerRef === '' ? '-' : providerRef.split('/')[1];
    orgRef = orgRef === '' ? '-' : orgRef.split('/')[1];

    // const [provider, facility, facilityTel] = await getRefValues(resource);

    return {
      startDate,
      providerRef,
      orgRef,
      locationType: lType
    };
  };

  // console.log('data', data);
  const filteredData = data.map((res) => getValObj(res));

  return filteredData.length === 0 ? (
    <Info text="No data found" icon="error" />
  ) : (
    <Table data={filteredData} schema={schema} withPagination pageSize="9" showMenu />
  );
};

export default Encounter;
