import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';

import { ROUTE_ENGLISH_TEXTBOOK, ROUTE_ENGLISH_RESULT } from '../../../utils/constants';

const { SubMenu } = Menu;

const menu = [
  {
    key: 'sub0',
    icon: 'calendar',
    name: '计划',
    items: [{ key: 'sub0-1', name: '课程表' }, { key: 'sub0-2', name: '日程表' }],
  },
  { key: 'sub1', icon: 'ordered-list', name: 'TODO', items: [{ key: 'sub1-1', name: '作业' }] },
  { key: 'sub2', icon: 'diff', name: '考试成绩', items: [{ key: 'sub2-1', name: '成绩' }] },
  {
    key: 'sub3',
    icon: 'file-done',
    name: '错题本',
    items: [{ key: 'sub3-1', name: '数学' }, { key: 'sub3-2', name: '语文' }, { key: 'sub3-3', name: '英语' }],
  },
  {
    key: 'sub4',
    icon: 'global',
    name: '英语',
    items: [
      { key: 'sub4-1', name: '单词练习', url: ROUTE_ENGLISH_TEXTBOOK },
      { key: 'sub4-2', name: '练习历史', url: ROUTE_ENGLISH_RESULT },
    ],
  },
  { key: 'sub5', icon: 'read', name: '读书笔记', items: [{ key: 'sub5-1', name: '读书' }] },
  { key: 'sub6', icon: 'profile', name: '诗词', items: [{ key: 'sub6-1', name: '诗词鉴赏' }] },
  { key: 'sub7', icon: 'bulb', name: '成语', items: [{ key: 'sub7-1', name: '成语鉴赏' }] },
];

const CSideBar = () => {
  const [selectedMenu, setSelectedMenu] = useState('sub1-1');

  const handleClick = item => {
    setSelectedMenu(item.key);
  };

  return (
    <Menu onClick={handleClick} defaultSelectedKeys={[selectedMenu]} defaultOpenKeys={[selectedMenu]} mode="inline">
      {menu.map(m => {
        return (
          <SubMenu
            key={m.key}
            title={
              <span>
                <Icon type={m.icon} />
                <span>{m.name}</span>
              </span>
            }
          >
            {m.items.map(i => {
              return (
                <Menu.Item key={i.key}>
                  <Link to={i.url}>{i.name}</Link>
                </Menu.Item>
              );
            })}
          </SubMenu>
        );
      })}
    </Menu>
  );
};

export default CSideBar;
