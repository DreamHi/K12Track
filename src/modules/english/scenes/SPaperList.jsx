import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import qs from 'query-string';
import { Breadcrumb, Table, Button, Divider, Modal, message } from 'antd';

import CQuestionRandom from '../components/CQuestionRandom';
import CQuestionRecognize from '../components/CQuestionRecognize';

import {
  API_PAPER_LIST,
  API_PAPER_GET,
  API_EXAM_POST,
  ROUTE_ENGLISH_TEXTBOOK,
  ROUTE_ENGLISH_RESULT,
  ROUTE_ENGLISH_RESULT_DETAIL,
  QUESTION_TYPES_RANDOM,
  QUESTION_TYPES_RECOGNIZE,
} from '../../../utils/constants';
import { post, get } from '../../../utils/fetch';
import { forEach, generateUUID, isArray } from '../../../utils/helper';

const SPaperList = props => {
  const [paperList, setPaperList] = useState({});
  const [visible, setVisible] = useState(false);
  const [exam, setExam] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const getList = async () => {
    try {
      const { grade } = qs.parse(props.location.search);
      const res = await post(API_PAPER_LIST, { grade });
      setPaperList(res);
    } catch (err) {
      message.error('数据取得失败！');
    }
  };

  const handleStartClick = async qId => {
    try {
      const res = await get(`${API_PAPER_GET}/${qId}`);
      const initAnswer = {};
      forEach(res.questions, (q, index) => {
        if (q.type === QUESTION_TYPES_RANDOM) {
          initAnswer[index] = new Array(q.length).fill('');
          const newQ = q.randomWord.split('');
          // eslint-disable-next-line no-param-reassign
          q.randomWordObj = newQ.map(w => {
            return { value: w, disabled: false };
          });
        }

        if (q.type === QUESTION_TYPES_RECOGNIZE) {
          initAnswer[index] = '';
        }
      });

      setExam(res);
      setAnswers(initAnswer);
      setVisible(true);
    } catch (err) {
      message.error('数据取得失败！');
    }
  };

  const handleCancelClick = () => {
    setVisible(false);
  };

  const handlePrevClick = () => {
    const { length } = exam.questions || [];
    if (length > 0 && currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextClick = () => {
    const { length } = exam.questions || [];
    if (currentIndex + 1 <= length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleAnswerClick = (w, i) => {
    const index = answers[currentIndex].indexOf('');
    if (index !== -1) {
      answers[currentIndex][index] = w.value;
      setAnswers({ ...answers });
    }
    exam.questions[currentIndex].randomWordObj[i].disabled = !exam.questions[currentIndex].randomWordObj[i].disabled;
    setExam({ ...exam });
  };

  const handleAnswerSelect = (a, index) => {
    if (a) {
      answers[currentIndex][index] = '';
      setAnswers({ ...answers });
      const r = exam.questions[currentIndex].randomWordObj;
      let idx = null;

      forEach(r, (w, i) => {
        if (w.value === a && w.disabled) {
          idx = i;
        }
      });

      if (idx !== null) {
        exam.questions[currentIndex].randomWordObj[idx].disabled = false;
        setExam({ ...exam });
      }
    }
  };

  const handleAnswerChange = a => {
    answers[currentIndex] = a;
    setAnswers({ ...answers });
  };

  const handleSubmit = async () => {
    try {
      const rs = await post(API_EXAM_POST, { paper: exam, answers });
      setVisible(false);
      props.history.push(`${ROUTE_ENGLISH_RESULT_DETAIL}/${rs._id}`);
    } catch (e) {
      // console.log(e);
    }
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
      render: (text, record) => {
        const { groups } = paperList;
        let count = 0;
        for (let index = 0; index < groups.length; index++) {
          const obj = groups[index]._id;
          if (obj.grade === record.grade && obj.name === record.name) {
            count = obj.len || 0;
            break;
          }
        }
        return <span>{count}</span>;
      },
    },
    {
      title: '答题次数',
      render: (text, record) => {
        const { groups } = paperList;
        let count = 0;
        for (let index = 0; index < groups.length; index++) {
          const obj = groups[index]._id;
          if (obj.grade === record.grade && obj.name === record.name) {
            count = groups[index].count || 0;
            break;
          }
        }

        return <span>{count}</span>;
      },
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
          <Button
            type="primary"
            size="small"
            onClick={() => {
              props.history.push(ROUTE_ENGLISH_RESULT);
            }}
          >
            历史
          </Button>
        </span>
      ),
    },
  ];

  const { length } = exam.questions || [];
  const q = exam.questions && exam.questions[currentIndex];

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>主页</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={ROUTE_ENGLISH_TEXTBOOK}>英语</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>考试</Breadcrumb.Item>
      </Breadcrumb>
      <div className="textbook">
        <div className="paper">
          <Table
            dataSource={paperList.items}
            columns={columns}
            rowKey={record => {
              return record._id;
            }}
          />
        </div>
        <Modal
          width={1024}
          title={`[考试开始]  ${exam.paper && exam.paper.grade}: ${exam.paper && exam.paper.name}`}
          visible={visible}
          wrapClassName="vertical-center-modal"
          footer={null}
          onCancel={handleCancelClick}
        >
          <div className="question-preview">
            <div className="header">
              <div className="time">题号：</div>
              <div className="q">
                {Object.values(answers).map((a, i) => {
                  let aStr = a;
                  if (isArray(a)) {
                    aStr = a.join('');
                  }
                  return (
                    <span key={generateUUID()} className={aStr ? 'selected' : ''} onClick={() => setCurrentIndex(i)}>
                      {i + 1}
                    </span>
                  );
                })}
              </div>
              <div className="submit">
                <Button type="primary" onClick={handleSubmit}>
                  交卷
                </Button>
              </div>
            </div>
            <div className="question">
              {q && q.type === QUESTION_TYPES_RANDOM && (
                <CQuestionRandom
                  key={q._id}
                  value={q}
                  answer={answers[currentIndex]}
                  onClick={handleAnswerClick}
                  onSelect={handleAnswerSelect}
                />
              )}
              {q && q.type === QUESTION_TYPES_RECOGNIZE && (
                <CQuestionRecognize
                  key={q._id}
                  value={q}
                  answer={answers[currentIndex]}
                  onChange={handleAnswerChange}
                />
              )}
            </div>
            <div className="operation">
              <Button type="primary" className="prev" disabled={currentIndex <= 0} onClick={handlePrevClick}>
                上一题
              </Button>
              <div className="process">{length !== 0 && <span>{`${currentIndex + 1}/${length}`}</span>}</div>
              {currentIndex >= length - 1 ? (
                <Button type="primary" className="next" onClick={handleSubmit}>
                  交卷
                </Button>
              ) : (
                <Button type="primary" className="next" disabled={currentIndex >= length - 1} onClick={handleNextClick}>
                  下一题
                </Button>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

SPaperList.defaultProps = {};

SPaperList.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.object.isRequired,
};

export default SPaperList;
