import React from 'react';
import styled from '@emotion/styled';
import { Flex, Box } from 'reflexbox';
import { Link } from 'gatsby';

import Page from 'components/Page';
import ContentSection from 'components/ContentSection';
import CenterContent from 'components/CenterContent';
import SectionIntro from 'components/SectionIntro';
import Button from 'components/Button';
import CodeBlock from 'components/CodeBlock';
import Showcases from 'components/Showcases';
import Icon from 'components/Icon';
import HeroFlow from 'components/HeroFlow';
import FlowA from 'components/TeaserFlow/A';
import FlowB from 'components/TeaserFlow/B';
import FlowC from 'components/TeaserFlow/C';
import { Paragraph, H1, H4 } from 'components/Typo';
import { baseColors } from 'themes';
import { getThemeColor, device } from 'utils/css-utils';

const metaTags = {
  title: 'React Flow',
  description:
    'Highly customizable React.js library for building interactive node-based editors, flow charts and diagrams.',
  siteUrl: 'https://reactflow.dev',
  robots: 'index,follow',
};

const HeroWrapper = styled(Box)`
  position: relative;
  height: 500px;
`;

const SectionSubtitle = styled(H4)`
  font-weight: 400;
  line-height: 1.5;
  margin: 30px 0;
  color: ${getThemeColor('silverDarken30')};
`;

const HeadlineAbsolute = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  height: 100%;
  pointer-events: none;
`;

const HeadlineWrapper = styled(Box)`
  max-width: 400px;

  ${H1} {
    margin-top: 0;
  }
`;

const DocsButton = styled(Button)`
  margin-right: 24px;
  pointer-events: all;
  background: ${getThemeColor('red')};
`;

const ExampleButton = styled(Link)`
  pointer-events: all;
  display: flex;
  font-weight: bold;
  align-items: center;

  &&& {
    color: ${getThemeColor('red')};

    svg {
      transform: translateX(0px);
      transition: all 0.125s ease-in-out;
    }

    polyline,
    path,
    line {
      stroke: none;
      fill: ${getThemeColor('red')};
    }

    &:hover {
      color: ${getThemeColor('red')};

      svg {
        transform: translateX(5px);
        transition: all 0.125s ease-in-out;
      }
    }
  }
`;

const ContactButton = styled(Button)`
  background: ${getThemeColor('red')};
  margin-right: 16px;
`;

const WorkButton = styled(Button)`
  background: ${getThemeColor('violet')};

  &:hover {
    background: ${getThemeColor('red')};
  }
`;

const CenterHeadline = styled(CenterContent)`
  display: flex;
  flex-direction: column;
  height: 100%;

  @media ${device.tablet} {
    justify-content: center;
  }
`;

const GettingStartedWrapper = styled(Box)`
  max-width: 800px;
  margin: 0 auto;
`;

const Home = () => {
  return (
    <Page metaTags={metaTags}>
      <HeroWrapper>
        <HeroFlow />
        <HeadlineAbsolute>
          <CenterHeadline>
            <HeadlineWrapper>
              <H1>Wire your ideas with React Flow</H1>
              <SectionSubtitle>
                Highly customizable React.js library for building node-based
                editors and diagrams.
              </SectionSubtitle>
              <Flex mt={3} alignItems="center">
                <DocsButton
                  as={Link}
                  to="/docs/"
                  icon="code"
                  colorizeStroke
                  color="textInverted"
                  type="big"
                >
                  Documentation
                </DocsButton>
                <ExampleButton to="/examples/">
                  Examples
                  <Icon
                    width="40px"
                    name="arrow_right"
                    colorizeStroke
                    strokeColor="text"
                    ml={1}
                  />
                </ExampleButton>
              </Flex>
            </HeadlineWrapper>
          </CenterHeadline>
        </HeadlineAbsolute>
      </HeroWrapper>

      <ContentSection bg="violetLighten5">
        <CenterContent>
          <SectionIntro
            title="Getting Started"
            text="React Flow enables you to build node-based applications. From simple static diagrams to complex interactive editors."
            color={baseColors.textLight}
          />
          <GettingStartedWrapper>
            <Paragraph mb={3} color={baseColors.textLight}>
              React Flow is published on{' '}
              <a
                href="https://www.npmjs.com/package/react-flow-renderer"
                target="_blank"
                rel="noopener noreferrer"
              >
                npm
              </a>
              . You can install it via:
            </Paragraph>
            <CodeBlock
              code={`npm install --save react-flow-renderer`}
              language="bash"
            />
            <Paragraph my={3} color={baseColors.textLight}>
              A flow consists of nodes and edges (or just nodes). Together we
              call them elements. You can pass a set of elements as a prop to
              the ReactFlow component. A simple flow could look like this:
            </Paragraph>
            <CodeBlock
              code={`import React from 'react';
import ReactFlow from 'react-flow-renderer';

const elements = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  // you can also pass a React Node as a label
  { id: '2', data: { label: <div>Node 2</div> }, position: { x: 100, y: 100 } },
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

export default () => <ReactFlow elements={elements} />;`}
            />
            <Paragraph mt={3} color={baseColors.textLight}>
              You can find a detailed{' '}
              <Link to="/docs/getting-started/">entry point</Link> in the docs
              or read our{' '}
              <a
                href="https://webkid.io/blog/react-flow-node-based-graph-library/"
                target="_blank"
                rel="noopener noreferrer"
              >
                blog post
              </a>{' '}
              to get started.
            </Paragraph>
          </GettingStartedWrapper>
        </CenterContent>
      </ContentSection>

      <ContentSection centered>
        <FlowA />
        <FlowB />
        <FlowC />
      </ContentSection>

      <ContentSection bg="violetLighten5">
        <SectionIntro
          title="Built with React Flow"
          text="You can do a wide range of applications with React Flow. Ranging from music synthesizers and study planners to visualizations of neural nets."
          color={baseColors.textLight}
        />
        <Showcases />
      </ContentSection>

      <ContentSection>
        <SectionIntro
          title="Do you want to build a data driven application?"
          text="Reach out and contact us. We’re happy to chat and always excited for a new data driven challenge."
        />

        <Flex justifyContent="center">
          <ContactButton
            as="a"
            href="https://webkid.io/contact"
            icon="mail"
            type="big"
            color="textInverted"
          >
            Contact us
          </ContactButton>
          <WorkButton
            as="a"
            href="https://webkid.io/portfolio"
            icon="eye"
            type="big"
            color="textInverted"
          >
            View other work
          </WorkButton>
        </Flex>
      </ContentSection>
    </Page>
  );
};

export default Home;
