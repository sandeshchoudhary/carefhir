import React from 'react';
import {
  Avatar,
  Heading,
  Badge,
  Card,
  Row,
  Column,
  Subheading,
  Placeholder,
  PlaceholderParagraph
} from '@innovaccer/design-system';
import './PatientInfo.css';

const columnOptions = {
  size: '6',
  sizeXL: '6',
  sizeM: '6'
};

const PatientInfo = (props) => {
  const { data = {}, loading } = props;

  const loadingRender = () => {
    return (
      <div>
        <Placeholder withImage round imageSize="medium">
          <PlaceholderParagraph length="large" />
        </Placeholder>
        <div className="PatientInfo-loading">
          <Placeholder>
            <PlaceholderParagraph length="medium" />
          </Placeholder>
        </div>
      </div>
    );
  };

  return (
    <Card
      shadow="dark"
      style={{
        width: '600px',
        padding: '16px',
        backgroundColor: 'white'
      }}
    >
      {loading ? (
        loadingRender()
      ) : (
        <div>
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
        </div>
      )}
    </Card>
  );
};

export default PatientInfo;
