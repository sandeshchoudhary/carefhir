import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Avatar, Heading, Badge, Subheading } from '@innovaccer/design-system';
import './PatientList.css';

const PatientList = (props) => {
  const { data = {} } = props;

  const getPatientCard = (patients = []) => {
    return patients.map((item, index) => {
      return (
        <div className="PatientList-itemWrapper">
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
      )
    })
  }

  return (
    <div className="PatientList">
      {getPatientCard(data.entry)}
    </div>
  );
};

export default PatientList;
