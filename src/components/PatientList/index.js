import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Avatar, Heading, Badge, Subheading, Spinner } from '@innovaccer/design-system';
import './PatientList.css';
import Info from '../Info';

const PatientList = (props) => {
  const { data = {}, onClick, loading = false } = props;

  const getPatientCard = (patients = []) => {
    return patients.map((item, index) => {
      return (
        <div className="PatientList-itemWrapper" key={index} onClick={(ev) => onClick(ev, item.resource.id)}>
          <div className="PatientList-item-heading">
            <Avatar appearance="primary">
              {`${item.resource.name[0].given[0].charAt(0)}${item.resource.name[0].family.charAt(0)}`}
            </Avatar>
            <Heading size="m">{`${item.resource.name[0].given[0]}, ${item.resource.name[0].family}`}</Heading>
            <Badge appearance="secondary">{item.resource.id}</Badge>
          </div>
          <div className="PatientList-item-info">
            <Subheading appearance="default">DOB: </Subheading>
            <Subheading appearance="subtle">{item.resource.birthDate}</Subheading>
            <Subheading appearance="default">Gender: </Subheading>
            <Subheading appearance="subtle">{item.resource.gender}</Subheading>
          </div>
        </div>
      );
    });
  };

  const loadingState = () => (
    <div className="PatientList-loader">
      <Spinner size="large" />
    </div>
  );

  return loading ? (
    <div className="PatientList">{loadingState()}</div>
  ) : (
    <div className="PatientList">
      {!('entry' in data) || (data.entry && data.entry.length === 0) ? (
        <Info text="No data found" icon="error" />
      ) : (
        getPatientCard(data.entry)
      )}
    </div>
  );
};

export default PatientList;
