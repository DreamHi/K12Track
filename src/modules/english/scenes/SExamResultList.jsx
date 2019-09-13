import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Breadcrumb, Table, Button, message } from 'antd';
import moment from 'moment';

import { API_EXAM_LIST, ROUTE_ENGLISH_RESULT_DETAIL, ROUTE_ENGLISH_TEXTBOOK } from '../../../utils/constants';
import { get } from '../../../utils/fetch';

const SExamResultList = props => {
  const [examResultList, setExamResultList] = useState([]);

  const getList = async () => {
    try {
      const { items } = await get(API_EXAM_LIST);
      setExamResultList(items);
    } catch (err) {
      message.error('数据取得失败！');
    }
  };

  const handleDetailClick = id => {
    props.history.push(`${ROUTE_ENGLISH_RESULT_DETAIL}/${id}`);
  };

  useEffect(() => {
    getList();
  }, []);

  const columns = [
    {
      title: '年级',
      dataIndex: 'grade',
      render: (text, record) => <span>{record.paper.grade}</span>,
    },
    {
      title: '试卷名',
      dataIndex: 'name',
      render: (text, record) => <span>{record.paper.name}</span>,
    },
    {
      title: '考试分数',
      render: (text, record) => <span>{`${parseInt(record.score * 100, 10)} 分`}</span>,
    },
    {
      title: '考试题数',
      render: (text, record) => <span>{record.questions.length}</span>,
    },
    {
      title: '考试时间',
      dataIndex: 'updatedAt',
      render: text => {
        const stringTime = moment(text).format('YYYY/MM/DD HH:mm');
        return <span className="word-wrap">{stringTime}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (t, r) => (
        <span>
          <Button type="primary" size="small" onClick={() => handleDetailClick(r._id)}>
            详细
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>主页</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={ROUTE_ENGLISH_TEXTBOOK}>英语</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>考试历史</Breadcrumb.Item>
      </Breadcrumb>
      <div className="textbook">
        <div className="paper">
          <Table
            dataSource={examResultList}
            columns={columns}
            rowKey={record => {
              return record._id;
            }}
          />
        </div>
      </div>
    </div>
  );
};

SExamResultList.propTypes = {
  history: PropTypes.object.isRequired,
};

export default SExamResultList;
