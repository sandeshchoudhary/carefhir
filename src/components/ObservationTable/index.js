import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Table } from '@innovaccer/design-system';
import { condition, getIssuedDate, getValue, getInterpretation, getComponentVals, schema } from './helpers';
import Info from '../Info';

const ObservationTable = (props) => {
  const { data = [] } = props;

  const getInterpObj = (interpretation) => {
    if (interpretation.toLowerCase().includes('normal') && interpretation.length > 0) {
      return { statusAppearance: 'success', title: interpretation };
    }
    if (interpretation.length === 0) {
      return { statusAppearance: 'default', title: '-' };
    }
    return { statusAppearance: 'alert', title: interpretation };
  };

  const filterData = (arr) => {
    const filteredData = [];
    arr.forEach((e) => {
      const cndn = condition(e);
      const val = getValue(e);
      const interpret = getInterpretation(e);
      const componentVals = getComponentVals(e);
      const issuedDate = getIssuedDate(e);

      if (componentVals.length > 0) {
        componentVals.forEach((comp) => {
          const [cdn, value, interp] = comp;
          if (value !== 'N/A') {
            filteredData.push({
              value,
              condition: cdn,
              interpretation: getInterpObj(interp),
              issued: issuedDate
            });
          }
        });
      } else if (val !== 'N/A') {
        filteredData.push({
          condition: cndn,
          value: val,
          interpretation: getInterpObj(interpret),
          issued: issuedDate
        });
      }
    });
    return filteredData;
  };

  const filteredData = filterData(data);
  // const filteredData = [];

  return filteredData.length === 0 ? (
    <Info text="No data found" icon="error" />
  ) : (
    <Table data={filteredData} schema={schema} />
  );
};

export default ObservationTable;
