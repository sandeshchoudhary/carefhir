import React from 'react';
import { Icon, Heading, Card, Row, Column } from '@innovaccer/design-system';
import './Info.css';

const Info = (props) => {
  const { text, icon } = props;

  return (
    <div className="Info-wrapper">
      <Icon size="37" name={icon} type="filled" appearance="subtle" />
      <Heading appearance="subtle" size="m">
        {text}
      </Heading>
    </div>
  );
};

export default Info;
