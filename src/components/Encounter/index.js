import axios from 'axios';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { schema } from './schema';
import { Table } from '@innovaccer/design-system';
import Info from '../Info';

const Encounter = (props) => {
  const { data = [], fhirServer, serverHeaders } = props;

  const [encData, setEncData] = useState([]);
  const [loading, setLoading] = useState(true);

  // send api request
  const getRefResource = (baseAddress, headers, ref) => {
    return axios.get(`${baseAddress}/${ref}`, {
      headers: headers
    });
  };

  // filter required data and make api requests for provider, organization
  const filterData = async (baseAddress, headers, data) => {
    let pRef = [];
    let oRef = [];
    let encData = [];

    for (let idx = 0; idx < data.length; idx++) {
      const resource = data[idx];
      const participant = resource.participant && resource.participant.length > 0 ? resource.participant[0] : '-';
      const providerRef = participant && participant.individual ? participant.individual.reference : '';
      const orgRef =
        resource.serviceProvider && resource.serviceProvider.reference ? resource.serviceProvider.reference : '';

      let provider = '-';
      let facility = '-';

      // get value for location type, startData
      const rType = resource.type && resource.type.length > 0 ? resource.type[0] : '-';
      const lType = rType && rType.text ? rType.text : '-';
      const sDate = resource.period ? resource.period.start : '-';
      const dateStr = sDate === '-' ? '-' : new Date(sDate);
      const startDate =
        dateStr === '-' ? '-' : `${dateStr.getMonth() + 1}-${dateStr.getDate()}-${dateStr.getFullYear()}`;

      const pIdx = pRef.indexOf(providerRef);
      const oIdx = oRef.indexOf(orgRef);

      if (providerRef !== '' && pIdx === -1) {
        const providerData = await getRefResource(baseAddress, headers, providerRef);
        const pName = `${providerData.data.name[0].given[0]}, ${providerData.data.name[0].family}`;
        // two pushes making sure we get value at pIdx + 1
        pRef.push(providerRef);
        pRef.push(pName);
      } else if (providerRef !== '' && pIdx !== -1) {
        provider = pRef[pIdx + 1];
      }

      if (orgRef !== '' && oIdx === -1) {
        const orgData = await getRefResource(baseAddress, headers, orgRef);
        const oName = orgData.data.name;
        const oTelecom = orgData.data.telecom[0].value;
        // two pushes ensuring we get values at oIdx + 1
        oRef.push(orgRef);
        oRef.push([oName, oTelecom]);
      } else if (orgRef !== '' && oIdx !== -1) {
        facility = oRef[oIdx + 1];
      }

      const dataObj = {
        lType,
        provider,
        startDate,
        facility: facility[0] ? facility[0] : '-',
        facilityTel: facility[1] ? facility[1] : '-'
      };

      encData.push(dataObj);
    }

    return encData;
  };

  // const tableData = () => {
  useEffect(() => {
    setLoading(true);
    filterData(fhirServer, serverHeaders, data)
      .then((res) => {
        setEncData(res);
        setLoading(false);
      })
      .catch((err) => alert(err));
  }, []);

  return <Table data={encData} loading={loading} schema={schema} />;
};

//   return filteredData.length === 0 ? (
//     <Info text="No data found" icon="error" />
//   ) : (
//     <Table data={filteredData} schema={schema} withPagination pageSize="9" showMenu />
//   );
// };

export default Encounter;
