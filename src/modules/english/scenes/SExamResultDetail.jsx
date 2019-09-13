import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { List, message, Icon, Breadcrumb } from 'antd';

import { API_EXAM_GET, ROUTE_ENGLISH_RESULT, ROUTE_ENGLISH_TEXTBOOK } from '../../../utils/constants';
import { get } from '../../../utils/fetch';

const SExamResultDetail = props => {
  const [examResultDetail, setExamResultDetail] = useState({});

  const getDetail = async () => {
    try {
      const rId = props.match.params.id;
      const rs = await get(`${API_EXAM_GET}/${rId}`);
      setExamResultDetail(rs);
    } catch (err) {
      message.error('数据取得失败！');
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  const { questions, paper, updatedAt, score } = examResultDetail;

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>主页</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={ROUTE_ENGLISH_TEXTBOOK}>英语</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={ROUTE_ENGLISH_RESULT}>考试结果</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>详细</Breadcrumb.Item>
      </Breadcrumb>
      <div className="exam-result-detail">
        <div className="paper">
          <h1>{paper && paper.name}</h1>
          <div className="detail">
            <span>年级：{paper && paper.grade}</span>
            <span>答题日期：{moment(updatedAt).format('YYYY/MM/DD HH:mm')}</span>
          </div>
          <div className="score">{parseInt(score * 100 || 0, 10)}</div>
        </div>
        <div className="answers">
          <List
            itemLayout="horizontal"
            dataSource={questions || []}
            renderItem={(item, i) => {
              let icon = null;
              const { question, answer } = item;
              if (answer.toLowerCase() === question.word.toLowerCase()) {
                icon = <Icon type="check" />;
              } else {
                icon = <Icon type="close" />;
              }
              return (
                <List.Item>
                  <div className="title">
                    {icon} {`题目${i + 1}：${question.meaning}`}
                  </div>
                  <div className="answer">
                    <strong>答案：</strong>
                    {answer}
                  </div>
                  <div className="correct">
                    <h4>解析：</h4>
                    <a
                      href={`http://dict.youdao.com/dictvoice?type=1&audio=${question.word}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Icon type="sound" />
                    </a>
                    <h4>
                      [单词] {question.word}　{question.phoneticSymbol}
                    </h4>
                    <h4>[例句] {question.example}</h4>
                  </div>
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

SExamResultDetail.propTypes = {
  match: PropTypes.object.isRequired,
};

export default SExamResultDetail;
