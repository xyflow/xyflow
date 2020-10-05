import React from 'react';
import styled from '@emotion/styled';
import { Flex } from 'reflexbox';
import { Link } from 'gatsby';

import Button from 'components/Button';
import { H3 } from 'components/Typo';
import { getThemeSpacePx } from 'utils/css-utils';

const Wrapper = styled(Flex)`
  text-align: center;

  ${H3} {
    margin-bottom: ${getThemeSpacePx(3)};
  }
`;

export default ({
  caption = 'Are you interested in a collaboration?',
  ...props
}) => {
  return (
    <Wrapper alignItems="center" px={2} flexDirection="column" {...props}>
      <H3 as="div">{caption}</H3>
      <Button as={Link} to="/contact" icon="mail">
        Contact us
      </Button>
    </Wrapper>
  );
};
