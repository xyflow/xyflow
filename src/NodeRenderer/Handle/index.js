import React from 'react';
import styled from '@emotion/styled';

const Handle = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
  background: #222;
  left: 50%;
  border-radius: 50%;
`;

export default props => <Handle {...props} />;
