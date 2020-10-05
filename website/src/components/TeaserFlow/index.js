import React from 'react';
import styled from '@emotion/styled';
import { Flex, Box } from 'reflexbox';
import Link from 'gatsby-link';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
} from 'react-flow-renderer';

import { H2, Text } from 'components/Typo';
import Icon from 'components/Icon';
import { baseColors } from 'themes';

const Wrapper = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const ReactFlowWrapper = styled(Box)`
  height: 400px;
  background: ${(p) => (p.isDark ? baseColors.violet : 'white')};
  border-radius: 5px;

  .react-flow__controls {
    opacity: ${(p) => (p.isDark ? 0.5 : 1)};
  }
`;

const DocsLink = styled(Link)`
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const Description = ({ title, description }) => (
  <Box width={[1, 1, 0.35]}>
    <H2>{title}</H2>
    <Text>{description}</Text>
    <DocsLink to="/docs">
      Documentation{'  '}
      <Icon width={24} name="arrow_right" colorizeStroke strokeColor="red" />
    </DocsLink>
  </Box>
);

export default ({
  title,
  description,
  textPosition = 'left',
  flowProps,
  withControls = false,
  withMinimap = false,
  isDark = false,
  linesBg = false,
  children,
}) => {
  const bgColor = isDark ? baseColors.violetLighten60 : baseColors.violet;

  return (
    <Wrapper mb={[6, 6, 7]}>
      {textPosition === 'left' && (
        <Description title={title} description={description} />
      )}
      <ReactFlowWrapper width={[1, 1, 0.6]} isDark={isDark}>
        {children ? (
          children
        ) : (
          <ReactFlowProvider>
            <ReactFlow {...flowProps} zoomOnScroll={false}>
              <Background
                color={linesBg ? '#eee' : bgColor}
                gap={15}
                variant={linesBg ? 'lines' : 'dots'}
              />
              {withControls && <Controls />}
              {withMinimap && <MiniMap />}
            </ReactFlow>
          </ReactFlowProvider>
        )}
      </ReactFlowWrapper>
      {textPosition !== 'left' && (
        <Description title={title} description={description} />
      )}
    </Wrapper>
  );
};
