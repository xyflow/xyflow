import React from 'react';
import cx from 'classnames';

export default (props) => {
  const handleClasses = cx(
    'react-graph__handle', {
      input: props.input,
      output: props.output
    }
  );

  return (
    <div className={handleClasses} {...props} />
  );
};
