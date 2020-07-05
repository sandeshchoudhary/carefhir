import React, { useState, useEffect, useRef, useCallback } from 'react';
import { schema } from './schema';
import { Table } from '@innovaccer/design-system';
import Info from '../Info';

const Condition = (props) => {
  const { data = [] } = props;
  console.log(data);
  const [conData, setConData] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter required data
  const filterData = (data) => {
    let conData = [];

    for (let idx = 0; idx < data.length; idx++) {
      const resource = data[idx];
      const verificationStatus =
        resource.verificationStatus &&
        resource.verificationStatus.coding[0] &&
        resource.verificationStatus.coding[0].code
          ? resource.verificationStatus.coding[0].code
          : '-';
      const severity =
        resource.severity && resource.severity.coding[0] && resource.severity.coding[0].display
          ? resource.severity.coding[0].display
          : '-';
      const codeText =
        resource.code && resource.code.coding[0] && resource.code.coding[0].display
          ? resource.code.coding[0].display
          : '-';
      const recordedDate = resource.recordedDate ? resource.recordedDate : '-';

      const dataObj = {
        codeText,
        recordedDate,
        verificationStatus: verificationStatus.toUpperCase(),
        severity: severity.toUpperCase()
      };

      conData.push(dataObj);
    }

    return Promise.resolve(conData);
  };

  // const tableData = () => {
  useEffect(() => {
    setLoading(true);
    filterData(data)
      .then((res) => {
        setConData(res);
        setLoading(false);
      })
      .catch((err) => alert(err));
  }, []);

  return <Table data={conData} loading={loading} schema={schema} />;
};

export default Condition;
