import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Form, Input, Button, Icon, message } from 'antd';

import logo from '../../../static/img/logo.png';

import { ROUTE_HOME, API_LOGIN } from '../../../utils/constants';
import Storage from '../../../utils/storage';
import { post } from '../../../utils/fetch';

const FormItem = Form.Item;

const SLogin = props => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!name) {
      message.error(formatMessage({ id: 'login.label.name.check' }));
    }
    if (!pass) {
      message.error(formatMessage({ id: 'login.label.password.check' }));
    }

    if (name && pass) {
      try {
        const result = await post(API_LOGIN, { name, pass });
        Storage.setToken(result.token);
        Storage.setUser(result.user);
        props.history.push(ROUTE_HOME);
      } catch (error) {
        message.error(error.message);
      }
    }
  };

  return (
    <div className="login">
      <div className="form">
        <div className="logo">
          <img src={logo} alt="logo" />
          <span>学习印迹</span>
        </div>
        <Form>
          <FormItem>
            <Input
              value={name}
              prefix={<Icon type="user" />}
              placeholder={formatMessage({ id: 'login.label.name' })}
              onChange={e => setName(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Input
              value={pass}
              type="password"
              autoComplete="off"
              prefix={<Icon type="lock" />}
              placeholder={formatMessage({ id: 'login.label.password' })}
              onChange={e => setPass(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Button
              className={!name && !pass ? 'button-disabled' : 'button-enable'}
              disabled={!name && !pass}
              onClick={handleSubmit}
            >
              <FormattedMessage id="login.button.name" />
            </Button>
          </FormItem>
        </Form>
      </div>
      <div className="footer">
        <p>Copyright © 2019 HiDream Corporation. All Rights Reserved.</p>
      </div>
    </div>
  );
};

SLogin.defaultProps = {};

SLogin.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default SLogin;
