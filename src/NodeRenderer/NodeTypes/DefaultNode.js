import React from 'react';
import styled from '@emotion/styled';

import wrapNode from './wrapNode';
import Handle from '../Handle';

const Wrapper = styled.div`
  background: #ff6060;
  padding: 10px;
`;

export default wrapNode(({ data, style }) => (
  <Wrapper style={style}>
    <Handle style={{ top: 0 }} />
    {data.label}
    <Handle style={{ bottom: 0, top: 'auto', transform: 'translate(-50%, 50%)' }} />
  </Wrapper>
));
