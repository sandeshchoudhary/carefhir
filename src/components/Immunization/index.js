import React, { useState, useEffect, useRef, useCallback } from 'react';
import { schema } from './schema';
import { Table } from '@innovaccer/design-system';
import Info from '../Info';

const Immunization = (props) => {
  const { data = [], loading } = props;
  const [immuneData, setImmuneData] = useState([]);
  const [immuneLoading, setImmuneLoading] = useState(true);

  // filter required data
  const filterData = (data) => {
    let immuneData = [];

    for (let idx = 0; idx < data.length; idx++) {
      const resource = data[idx];
      const oDate = resource.occurrenceDateTime ? new Date(resource.occurrenceDateTime) : '-';
      const occurenceDate = oDate === '-' ? '-' : `${oDate.getMonth() + 1}-${oDate.getDate()}-${oDate.getFullYear()}`;
      const vaccine =
        resource.vaccineCode && resource.vaccineCode.coding[0] && resource.vaccineCode.coding[0].display
          ? resource.vaccineCode.coding[0].display
          : '-';
      const status = resource.status ? resource.status.toUpperCase() : '-';

      const dataObj = {
        occurenceDate,
        vaccine,
        status
      };

      immuneData.push(dataObj);
    }

    return Promise.resolve(immuneData);
  };

  //   // const tableData = () => {
  useEffect(() => {
    filterData(data)
      .then((res) => {
        setImmuneData(res);
        setImmuneLoading(false);
      })
      .catch((err) => alert(err));
  }, [props]);

  return <Table data={immuneData} loading={loading || immuneLoading} schema={schema} />;
};

export default Immunization;
