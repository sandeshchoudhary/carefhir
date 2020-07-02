import React from 'react';
import { Avatar, Heading, Badge, Card, Row, Column, Subheading, Spinner } from '@innovaccer/design-system';
import './PatientInfo.css';

const columnOptions = {
  size: '6',
  sizeXL: '6',
  sizeM: '6'
};

const PatientInfo = (props) => {
  const { data = {}, loading = false } = props;

  const loadingState = () => (
    <div className="PatientInfo-loading">
      <Spinner size="large" />
    </div>
  );

  return loading ? (
    loadingState()
  ) : (
    <Card
      shadow="dark"
      style={{
        width: '600px',
        padding: '16px 16px',
        backgroundColor: 'white'
      }}
    >
      <div className="PatientInfo-heading">
        <Avatar appearance="primary">{`${data.name[0].given[0].charAt(0)}${data.name[0].family.charAt(0)}`}</Avatar>
        <Heading size="m">{`${data.name[0].given[0]}, ${data.name[0].family}`}</Heading>
        <Badge appearance="secondary">{data.id}</Badge>
      </div>
      <div className="PatientInfo-body">
        <Row>
          <Column {...columnOptions}>
            <div className="PatientInfo-item">
              <Subheading appearance="default">DOB: </Subheading>
              <Subheading appearance="subtle">{data.birthDate}</Subheading>
            </div>
          </Column>
          <Column {...columnOptions}>
            <div className="PatientInfo-item">
              <Subheading appearance="default">Gender: </Subheading>
              <Subheading appearance="subtle">{data.gender}</Subheading>
            </div>
          </Column>
        </Row>
        <Row>
          <Column {...columnOptions}>
            <div className="PatientInfo-item">
              <Subheading appearance="default">Marital Status: </Subheading>
              <Subheading appearance="subtle">{data.maritalStatus ? data.maritalStatus.text : 'N/A'}</Subheading>
            </div>
          </Column>
          <Column {...columnOptions}>
            <div className="PatientInfo-item">
              <Subheading appearance="default">Contact: </Subheading>
              <Subheading appearance="subtle">{data.telecom ? data.telecom[0].value : 'N/A'}</Subheading>
            </div>
          </Column>
        </Row>
      </div>
    </Card>
  );
};

export default PatientInfo;
