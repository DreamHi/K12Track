import React from 'react';
import * as PropTypes from 'prop-types';

import { generateUUID } from '../../../utils/helper';

const CQuestion = props => {
  const { value, answer, onClick, onSelect } = props;
  const { meaning, randomWordObj } = value;

  return (
    <div>
      <div className="title">{meaning}</div>
      <div className="content">
        {randomWordObj.map((w, index) => {
          return (
            <div
              className={w.disabled ? 'word-grid word-disabled' : 'word-grid'}
              key={generateUUID()}
              onClick={() => onClick(w, index)}
            >
              {w.value === ' ' ? '__' : w.value}
            </div>
          );
        })}
      </div>
      <div className="answer">
        {answer.map((a, index) => {
          return (
            <div key={generateUUID()} className="word-answer" onClick={() => onSelect(a, index)}>
              <div className="w-bug">{a === ' ' ? '__' : a}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

CQuestion.propTypes = {
  value: PropTypes.object,
  answer: PropTypes.array,
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
};

CQuestion.defaultProps = {
  value: {},
  answer: [],
  onClick: null,
  onSelect: null,
};

export default CQuestion;
