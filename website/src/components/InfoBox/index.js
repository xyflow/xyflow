import React from 'react';
import styled from '@emotion/styled';
import { Box } from 'reflexbox';

const Wrapper = styled(Box)`
  padding: 16px;
  background: ${(p) => p.theme.colors.violetLighten45};
  color: white;
  border-radius: 5px;
  margin: 20px 0;
`;

const Title = styled(Box)`
  font-size: 20px;
  margin-bottom: 4px;
  font-weight: 900;
`;

export default ({ title = null, text, ...rest }) => {
  return (
    <Wrapper {...rest}>
      <Title>{title}</Title>
      <div>{text}</div>
    </Wrapper>
  );
};
