import React, { memo } from 'react';
import cx from 'classnames';

export default memo(({ input, output, ...rest }) => {
  const handleClasses = cx(
    'react-graph__handle', { input, output }
  );

  return (
    <div
      className={handleClasses}
      {...rest}
    />
  );
});
