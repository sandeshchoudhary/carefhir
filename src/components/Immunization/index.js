import React, { useState, useEffect, useRef, useCallback } from 'react';
import { schema } from './schema';
import { Table } from '@innovaccer/design-system';
import Info from '../Info';

const Immunization = (props) => {
  const { data = [] } = props;
  console.log(data);
  const [immuneData, setImmuneData] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter required data
  const filterData = (data) => {
    let immuneData = [];

    for (let idx = 0; idx < data.length; idx++) {
      const resource = data[idx];
      const occurenceDate = resource.occurrenceDateTime ? resource.occurrenceDateTime : '-';
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
    setLoading(true);
    filterData(data)
      .then((res) => {
        setImmuneData(res);
        setLoading(false);
      })
      .catch((err) => alert(err));
  }, []);

  return <Table data={immuneData} loading={loading} schema={schema} />;
};

export default Immunization;
