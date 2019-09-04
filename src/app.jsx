import React from 'react';
import * as PropTypes from 'prop-types';

import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import CDefaultLayout from './modules/system/components/CDefaultLayout';
import SLogin from './modules/system/scenes/SLogin';
import SInternalServerError from './modules/system/scenes/SInternalServerError';
import SNotFound from './modules/system/scenes/SNotFound';
import SHome from './modules/system/scenes/SHome';
import STextBookList from './modules/english/scenes/STextBookList';
import SPaperList from './modules/english/scenes/SPaperList';
import SExamResultList from './modules/english/scenes/SExamResultList';

import './static/css/resetant.less';
import './static/css/index.less';
import './static/css/layout.less';
import './static/css/login.less';
import './static/css/textbook.less';

import localZH from './locales/zh';
import localEN from './locales/en';
import localJA from './locales/ja';
import storage from './utils/storage';
import {
  ROUTE_HOME,
  ROUTE_LOGIN,
  ROUTE_ENGLISH_TEXTBOOK,
  ROUTE_ENGLISH_PAPAR,
  ROUTE_ENGLISH_RESULT,
  ROUTE_ERROR,
} from './utils/constants';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        storage.isAuthenticatedUser() ? (
          <CDefaultLayout>
            <Component {...props} />
          </CDefaultLayout>
        ) : (
          <Redirect to={ROUTE_LOGIN} />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (!storage.isAuthenticatedUser() ? <Component {...props} /> : <Redirect to={ROUTE_HOME} />)}
    />
  );
};

PublicRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

const chooseLocale = () => {
  let rtn = localZH;
  switch (navigator.language.split('-')[0]) {
    case 'en':
      rtn = localEN;
      break;
    case 'zh':
      rtn = localZH;
      break;
    case 'ja':
      rtn = localJA;
      break;
    default:
      rtn = localZH;
      break;
  }
  return rtn;
};

const App = () => {
  return (
    <IntlProvider locale={navigator.language} messages={chooseLocale()}>
      <Router>
        <Switch>
          <PublicRoute path="/" exact component={SLogin} />
          <PublicRoute path={ROUTE_LOGIN} exact component={SLogin} />
          <PrivateRoute path={ROUTE_HOME} exact component={SHome} />
          <PrivateRoute path={ROUTE_ENGLISH_TEXTBOOK} exact component={STextBookList} />
          <PrivateRoute path={ROUTE_ENGLISH_PAPAR} exact component={SPaperList} />
          <PrivateRoute path={ROUTE_ENGLISH_RESULT} exact component={SExamResultList} />
          <Route path={ROUTE_ERROR} exact component={SInternalServerError} />
          <Route path="*" component={SNotFound} />
        </Switch>
      </Router>
    </IntlProvider>
  );
};

export default App;
