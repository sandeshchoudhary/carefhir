import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Table, Spinner } from '@innovaccer/design-system';
import { condition, getIssuedDate, getValue, getInterpretation, getComponentVals, schema } from './helpers';
import Info from '../Info';
import './ObservationTable.css';

const ObservationTable = (props) => {
  const { data = [], loading = false } = props;

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

  const loadingState = () => (
    <div className="ObservationTable-loading">
      <Spinner size="large" />
    </div>
  );

  return loading ? (
    <div>{loadingState()}</div>
  ) : filteredData.length === 0 ? (
    <Info text="No data found" icon="error" />
  ) : (
    <Table data={filteredData} schema={schema} withPagination pageSize="9" showMenu />
  );
};

export default ObservationTable;
