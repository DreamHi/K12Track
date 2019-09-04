import React from 'react';
import * as PropTypes from 'prop-types';

const CQuestion = props => {
  return <h1>{props.value}</h1>;
};

CQuestion.defaultProps = {
  value: {},
};

CQuestion.propTypes = {
  value: PropTypes.object,
};

export default CQuestion;
