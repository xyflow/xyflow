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
import { device, getThemeSpacePx } from 'utils/css-utils';

const Wrapper = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const ReactFlowWrapper = styled(Box)`
  height: 400px;
  background: ${(p) => (p.isDark ? baseColors.violet : 'white')};
  border-radius: 5px;
  order: 2;

  ${device.tablet} {
    order: ${(p) => p.order};
  }

  .react-flow__controls {
    opacity: ${(p) => (p.isDark ? 0.5 : 1)};
  }
`;

const DocsLink = styled(Link)`
  display: flex;
  font-weight: bold;
  align-items: center;
  margin-top: 16px;

  svg {
    transform: translateX(0px);
    transition: all 0.125s ease-in-out;
  }

  &:hover {
    svg {
      transform: translateX(5px);
      transition: all 0.125s ease-in-out;
    }
  }
`;

const DescriptionWrapper = styled(Box)`
  order: 1;
  margin-bottom: ${getThemeSpacePx(3)};

  ${device.tablet} {
    order: ${(p) => p.order};
  }
`;

const Description = ({ title, description }) => (
  <DescriptionWrapper width={[1, 1, 0.35]}>
    <H2>{title}</H2>
    <Text style={{ opacity: 0.7 }}>{description}</Text>
    <DocsLink to="/docs">
      Documentation{'  '}
      <Icon width={42} name="arrow_right" colorizeStroke strokeColor="red" />
    </DocsLink>
  </DescriptionWrapper>
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
  const reactFlowOrder = textPosition === 'left' ? 2 : 1;

  return (
    <Wrapper mb={[6, 6, 7]}>
      {textPosition === 'left' && (
        <Description order={1} title={title} description={description} />
      )}
      <ReactFlowWrapper
        width={[1, 1, 0.6]}
        isDark={isDark}
        order={reactFlowOrder}
      >
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
        <Description order={2} title={title} description={description} />
      )}
    </Wrapper>
  );
};
