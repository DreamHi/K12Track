import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Card, message } from 'antd';

import { API_TEXTBOOK_LIST, ROUTE_ENGLISH_PAPAR, ROUTE_ENGLISH_TEXTBOOK } from '../../../utils/constants';
import { get } from '../../../utils/fetch';

const { Meta } = Card;

const STextBookList = () => {
  const [textBookList, setTextBookList] = useState([]);

  const getList = async () => {
    try {
      const res = await get(API_TEXTBOOK_LIST);
      setTextBookList(res);
    } catch (err) {
      message.error('数据取得失败！');
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>主页</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={ROUTE_ENGLISH_TEXTBOOK}>英语</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="textbook">
        <div className="list">
          {textBookList.map(t => {
            return (
              <Link to={`${ROUTE_ENGLISH_PAPAR}?grade=${t.grade}`}>
                <Card key={t._id} hoverable cover={<img alt="example" src={t.imgURL} />}>
                  <Meta title={t.grade} />
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default STextBookList;
