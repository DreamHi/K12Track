import React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

import { ROUTE_LOGIN } from '../../../utils/constants';

const SInternalServerError = props => {
  const { state } = props.history.location;
  let message;
  if (state) {
    if (state.errorCode === 401) {
      message = '登录超时，请重新登录。';
    } else if (state.errorCode === 500) {
      message = '系统错误发生，请重新登录。';
    }
  }
  return (
    <div className="error-wrapper">
      <span className="error-code">{state.errorCode || null}</span>
      <div className="error-message">{message || null}</div>
      <div className="return-btn">
        <Link to={ROUTE_LOGIN}>
          <Button type="primary">登录</Button>
        </Link>
      </div>
    </div>
  );
};

SInternalServerError.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({
      state: PropTypes.shape({
        errorCode: PropTypes.number,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default SInternalServerError;
