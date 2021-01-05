import React from 'react';
import PropTypes from 'prop-types';
import ReactRecaptcha from 'react-recaptcha';
import styled from 'styled-components';
import Translate from '../Translate/Translate.react';

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: 0.75rem;
  line-height: 0.75rem;
  color: rgb(244, 67, 54);
  margin-top: 0.36rem;
  text-align: center;
`;

const Recaptcha = ({ captchaKey, onCaptchaLoad, onCaptchaSuccess, error }) => (
  <React.Fragment>
    <Container>
      {captchaKey && (
        <ReactRecaptcha
          sitekey={captchaKey}
          render="explicit"
          onloadCallback={onCaptchaLoad}
          verifyCallback={onCaptchaSuccess}
          badge="inline"
          type="audio"
          size={window.innerWidth > 447 ? 'normal' : 'compact'}
        />
      )}
    </Container>
    {error && (
      <ErrorMessage>
        <Translate text={'Please verify that you are a human.'} />
      </ErrorMessage>
    )}
  </React.Fragment>
);

Recaptcha.propTypes = {
  captchaKey: PropTypes.string,
  onCaptchaLoad: PropTypes.func,
  onCaptchaSuccess: PropTypes.bool,
  error: PropTypes.func,
};

export default Recaptcha;
