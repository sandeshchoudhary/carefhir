import React from 'react';
import { Icon, Heading, Card, Row, Column } from '@innovaccer/design-system';
import './Info.css';

const Info = (props) => {
  const { text, icon } = props;

  return (
    <Card shadow="dark" style={{ width: '400px', height: '80px', margin: 'auto' }}>
      <div className="Info-wrapper">
        <div className="Info-wrapper-icon">
          <Icon name={icon} type="filled" />
        </div>
        <div className="Info-wrapper-heading">
          <Heading size="l">{text}</Heading>
        </div>
      </div>
    </Card>
  );
};

export default Info;
