import React, { useState, useEffect, useRef, useCallback } from 'react';
import { schema } from './schema';
import { Table } from '@innovaccer/design-system';
import Info from '../Info';

const Immunization = (props) => {
  const { data = [], loading } = props;

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

    return immuneData;
  };

  const immuneData = filterData(data);
  const noData = !loading && immuneData.length === 0;

  return <Table data={immuneData} error={noData} loading={loading} schema={schema} />;
};

export default Immunization;
