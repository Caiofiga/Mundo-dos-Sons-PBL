import React from 'react';
import { Alert } from 'react-bootstrap';
import '../css/AlertComponent.css'; 
import { CSSTransition } from 'react-transition-group';

interface AlertComponentProps {
  show: boolean;
  text: any;
  onClose: () => void;  // Added this line
}

const AlertComponent: React.FC<AlertComponentProps> = ({ show, text, onClose }) => {
  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames="alert"
      unmountOnExit
      onExited={onClose}
    >
      <Alert variant="success" onClick={onClose} dismissible>
        {text}
      </Alert>
    </CSSTransition>
  );
};



export default AlertComponent;
