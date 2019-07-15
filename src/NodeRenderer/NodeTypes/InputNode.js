import React from 'react';
import styled from '@emotion/styled';

import wrapNode from './wrapNode';
import Handle from '../Handle';

const Wrapper = styled.div`
  background: #9999ff;
  padding: 10px;
`;

export default wrapNode(({ data, style }) => (
  <Wrapper style={style}>
    {data.label}
    <Handle style={{ bottom: 0, top: 'auto', transform: 'translate(-50%, 50%)' }} />
  </Wrapper>
));
