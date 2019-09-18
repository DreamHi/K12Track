import React from 'react';
import * as PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import Recorder from 'js-audio-recorder';

import { API_WORD_REC } from '../../../utils/constants';
import { post } from '../../../utils/fetch';

let recorder;
const CQuestionRecognize = props => {
  const { value, answer, onChange } = props;
  const { word } = value;

  const start = () => {
    recorder = new Recorder({
      sampleBits: 16,
      sampleRate: 16000,
      numChannels: 1,
    });
    recorder.start();
  };

  const stop = async () => {
    // eslint-disable-next-line no-unused-expressions
    recorder && recorder.stop();
    const blob = recorder.getPCMBlob();
    const formData = new FormData();
    formData.append('files', blob);
    try {
      const rs = await post(API_WORD_REC, formData);
      onChange(rs && rs[0]);
    } catch (e) {
      // console.log(e);
    }
  };
  return (
    <div>
      <div className="title">{word}</div>
      <div className="content">
        <div className="audio-icon">
          <Icon
            type="audio"
            onMouseDown={() => {
              start();
            }}
            onMouseUp={() => {
              stop();
            }}
          >
            开始录音
          </Icon>
        </div>
      </div>
      <div className="answer">
        <Input className="answer-text" placeholder="答案" value={answer} onChange={e => onChange(e.target.value)} />
      </div>
    </div>
  );
};

CQuestionRecognize.propTypes = {
  value: PropTypes.object,
  answer: PropTypes.string,
  onChange: PropTypes.func,
};

CQuestionRecognize.defaultProps = {
  value: {},
  answer: '',
  onChange: null,
};

export default CQuestionRecognize;
