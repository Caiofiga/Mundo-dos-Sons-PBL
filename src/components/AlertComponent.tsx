import React from 'react';
import { Alert } from 'react-bootstrap';
import './AlertComponent.css'; 

interface AlertComponentProps {
  show: boolean;
  text: any;
}

const AlertComponent: React.FC<AlertComponentProps> = ({ show, text }) => {
  return (
    <Alert show={show} variant="success" className="alert-animation">
      {text}
    </Alert>
  );
};

export default AlertComponent;
