import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import qs from 'query-string';
import { Table, Button, Divider, Modal, message } from 'antd';

import { API_PAPER_LIST, API_PAPER_GET } from '../../../utils/constants';
import { post, get } from '../../../utils/fetch';

const SPaperList = props => {
  const [paperList, setPaperList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [exam, setExam] = useState({});

  const { grade } = qs.parse(props.location.search);
  const getList = async () => {
    try {
      const res = await post(API_PAPER_LIST, { grade });
      setPaperList(res);
    } catch (err) {
      message.error('数据取得失败！');
    }
  };

  const handleStartClick = async qId => {
    try {
      const res = await get(`${API_PAPER_GET}/${qId}`);
      setExam(res);
      setVisible(true);
    } catch (err) {
      message.error('数据取得失败！');
    }
  };

  const handleCancelClick = () => {
    setVisible(false);
  };

  useEffect(() => {
    getList();
  }, [getList]);

  const columns = [
    {
      title: '试卷名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: '试题数量',
      render: (text, record) => <span>{record.questions.length || 0}</span>,
    },
    {
      title: '答题次数',
      render: () => <span>100</span>,
    },
    {
      title: '操作',
      key: 'action',
      render: (t, r) => (
        <span>
          <Button type="primary" size="small" onClick={() => handleStartClick(r._id)}>
            开始
          </Button>
          <Divider type="vertical" />
          <Button type="primary" size="small">
            历史
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="textbook">
      <div className="paper">
        <Table dataSource={paperList} columns={columns} />
      </div>
      <Modal
        width={1024}
        title={`[考试开始]  ${exam.paper && exam.paper.grade}: ${exam.paper && exam.paper.name}`}
        visible={visible}
        wrapClassName="vertical-center-modal"
        footer={null}
        onCancel={handleCancelClick}
      >
        {exam.questions &&
          exam.questions.map(q => {
            return <div>{q.meaning}</div>;
          })}
      </Modal>
    </div>
  );
};

SPaperList.defaultProps = {};

SPaperList.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default SPaperList;
