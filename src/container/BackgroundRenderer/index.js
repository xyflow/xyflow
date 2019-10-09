import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Grid from './Grid';

const bgComponents = {
  lines: Grid,
  dots: Grid
};

const BackgroundRenderer = memo(({
  backgroundType, ...rest
}) => {
  const BackgroundComponent = bgComponents[backgroundType];
  return <BackgroundComponent {...rest} />
});

BackgroundRenderer.displayName = 'BackgroundRenderer';

BackgroundRenderer.propTypes = {
  backgroundType: PropTypes.oneOf(['lines', 'dots'])
};

BackgroundRenderer.defaultProps = {
  backgroundType: 'dots'
};

export default BackgroundRenderer;
