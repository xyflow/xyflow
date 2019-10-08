import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Grid from './Grid';

const bgComponents = {
  grid: Grid
};

const BackgroundRenderer = memo(({
  backgroundType, ...rest
}) => {
  const BackgroundComponent = bgComponents[backgroundType];
  return <BackgroundComponent {...rest} />
});

BackgroundRenderer.displayName = 'BackgroundRenderer';

BackgroundRenderer.propTypes = {
  backgroundType: PropTypes.oneOf(['grid'])
};

BackgroundRenderer.defaultProps = {
  backgroundType: 'grid'
};

export default BackgroundRenderer;
