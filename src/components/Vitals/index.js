import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Table } from '@innovaccer/design-system';
import { schema } from './schema';
import Info from '../Info';

const Vitals = (props) => {
  // 29463-7 => Body weight
  // 8302-2 => Body height
  // 39156-5 => BMI
  // 85354-9 => B.P.
  // 55284-4 => B.P. => handles both systolic (8480-6) and diastolic (8462-4)
  // by default shows these four

  const { data = [], loading, loinc = ['29463-7', '8302-2', '39156-5', '55284-4', '85354-9'] } = props;
  const [vitalData, setVitalData] = useState([]);
  const [vitalsLoading, setVitalsLoading] = useState(true);

  const filterData = (dataArr) => {
    const filteredData = [];

    dataArr.forEach((resource) => {
      const code = resource.code && resource.code.coding && resource.code.coding[0] ? resource.code.coding : '-';
      if (code !== '-') {
        const isPresent = code.some((coding) => {
          const c = coding.code ? coding.code : '-';
          return loinc.includes(c);
        });

        if (isPresent) {
          const name = code[0].display ? code[0].display : '-';
          const value =
            resource.valueQuantity && resource.valueQuantity.value
              ? `${resource.valueQuantity.value}`.slice(0, 5)
              : '-';
          const unit = resource.valueQuantity && resource.valueQuantity.unit ? resource.valueQuantity.unit : '-';
          const valStr = `${value} ${unit}`;
          const iDate = resource.issued ? new Date(resource.issued) : '-';
          const issued = iDate === '-' ? '-' : `${iDate.getMonth() + 1}-${iDate.getDate()}-${iDate.getFullYear()}`;

          if (Array.isArray(resource.component)) {
            resource.component.forEach((comp) => {
              const cName =
                comp.code && comp.code.coding && comp.code.coding[0] && comp.code.coding[0].display
                  ? comp.code.coding[0].display
                  : '-';

              const cValue =
                comp.valueQuantity && comp.valueQuantity.value ? `${comp.valueQuantity.value}`.slice(0, 5) : '-';
              const cUnit = comp.valueQuantity && comp.valueQuantity.unit ? comp.valueQuantity.unit : '-';
              const cValStr = `${cValue} ${cUnit}`;

              const compDataObj = {
                issued,
                name: cName,
                value: cValStr
              };
              filteredData.push(compDataObj);
            });
          } else {
            const dataObj = {
              name,
              issued,
              value: valStr
            };
            filteredData.push(dataObj);
          }
        }
      }
    });

    return Promise.resolve(filteredData);
  };

  useEffect(() => {
    filterData(data)
      .then((vData) => {
        setVitalData(vData);
        setVitalsLoading(false);
      })
      .catch((err) => alert(err));
  }, [props]);

  // return <h1>HI</h1>;
  return <Table data={vitalData} schema={schema} loading={loading || vitalsLoading} />;
};

export default Vitals;
