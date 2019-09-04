import React from 'react';
import * as PropTypes from 'prop-types';
import { Layout } from 'antd';

import CNav from './CNav';
import CSideBar from './CSideBar';

const { Header, Content, Sider } = Layout;

const CDefaultLayout = props => {
  return (
    <Layout>
      <Header>
        <CNav />
      </Header>
      <Layout>
        <Sider>
          <CSideBar />
        </Sider>
        <Content>{props.children}</Content>
      </Layout>
    </Layout>
  );
};

CDefaultLayout.defaultProps = {
  children: null,
};

CDefaultLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default CDefaultLayout;
