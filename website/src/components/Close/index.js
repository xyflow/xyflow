import React from 'react';
import styled from '@emotion/styled';
import { Flex } from 'reflexbox';

import { getThemeSpacePx } from 'utils/css-utils';
import Icon from 'components/Icon';

const Close = styled(Flex)`
  padding: ${getThemeSpacePx(1)};
  line-height: 1;
  width: 50px;
  height: 50px;
`;

export default ({ onClick, ...props }) => {
  return (
    <Flex pb={4} alignItems="center" justifyContent="center" {...props}>
      <Close alignItems="center" justifyContent="center" onClick={onClick}>
        <Icon name="close" strokeColor="text" colorizeStroke />
      </Close>
    </Flex>
  );
};
