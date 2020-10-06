import React, { Fragment } from 'react';
import { Box } from 'reflexbox';

import CenterContent from 'components/CenterContent';

export default ({
  children,
  bg = 'transparent',
  centered = false,
  id = null,
  big = false,
  ...rest
}) => {
  const WrapperComponent = centered ? CenterContent : Fragment;
  const wrapperProps = centered ? { big: big } : {};

  return (
    <Box id={id} bg={bg} py={[6, 7]} {...rest}>
      <WrapperComponent {...wrapperProps}>{children}</WrapperComponent>
    </Box>
  );
};
