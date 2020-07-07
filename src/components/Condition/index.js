import React, { useState, useEffect, useRef, useCallback } from 'react';
import { schema } from './schema';
import { Table } from '@innovaccer/design-system';
import Info from '../Info';

const Condition = (props) => {
  const { data = [], loading } = props;

  // filter required data
  const filterData = (data) => {
    let conData = [];

    for (let idx = 0; idx < data.length; idx++) {
      const resource = data[idx];
      const verificationStatus =
        resource.verificationStatus &&
        resource.verificationStatus.coding &&
        resource.verificationStatus.coding[0] &&
        resource.verificationStatus.coding[0].code
          ? resource.verificationStatus.coding[0].code
          : '-';
      const severity =
        resource.severity &&
        resource.severity.coding &&
        resource.severity.coding[0] &&
        resource.severity.coding[0].display
          ? resource.severity.coding[0].display
          : '-';
      const codeText =
        resource.code && resource.code.coding && resource.code.coding[0] && resource.code.coding[0].display
          ? resource.code.coding[0].display
          : '-';
      const rDate = resource.recordedDate ? new Date(resource.recordedDate) : '-';
      const recordedDate = rDate === '-' ? '-' : `${rDate.getMonth() + 1}-${rDate.getDate()}-${rDate.getFullYear()}`;

      const dataObj = {
        codeText,
        recordedDate,
        verificationStatus: verificationStatus.toUpperCase(),
        severity: severity.toUpperCase()
      };

      conData.push(dataObj);
    }

    return conData;
  };

  const conData = filterData(data);
  const noData = !loading && conData.length === 0;

  return <Table data={conData} error={noData} loading={loading} schema={schema} />;
};

export default Condition;
